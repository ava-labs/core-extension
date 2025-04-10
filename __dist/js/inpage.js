/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@avalabs/core-chains-sdk/esm/avalanche.chain.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/core-chains-sdk/esm/avalanche.chain.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AVALANCHE_P_DEV_NETWORK": () => (/* binding */ i),
/* harmony export */   "AVALANCHE_XP_NETWORK": () => (/* binding */ n),
/* harmony export */   "AVALANCHE_XP_TEST_NETWORK": () => (/* binding */ o),
/* harmony export */   "AVAX_TOKEN": () => (/* binding */ t),
/* harmony export */   "AvalancheCaip2ChainId": () => (/* binding */ s)
/* harmony export */ });
/* harmony import */ var _models_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models.js */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
const t={name:"Avalanche",symbol:"AVAX",decimals:9,description:"",logoUri:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png"},n={chainName:"Avalanche",chainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_XP,networkToken:t,vmName:_models_js__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM,description:"",platformChainId:"",subnetId:"",vmId:"",rpcUrl:"https://api.avax.network",isTestnet:!1,mainnetChainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_XP,logoUri:"https://github.com/ava-labs/chain-assets/blob/main/chains/43114/chain-logo.png",pricingProviders:{coingecko:{assetPlatformId:"avalanche",nativeTokenId:"avalanche-2"}},primaryColor:"#e84142",explorerUrl:"https://explorer-xp.avax.network/"},o={chainName:"Avalanche Fuji Testnet",chainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_TEST_XP,networkToken:t,vmName:_models_js__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM,description:"",platformChainId:"",subnetId:"",vmId:"",rpcUrl:"https://api.avax-test.network",isTestnet:!0,mainnetChainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_XP,logoUri:"https://github.com/ava-labs/chain-assets/blob/main/chains/43114/chain-logo.png",pricingProviders:{coingecko:{assetPlatformId:"avalanche",nativeTokenId:"avalanche-2"}},primaryColor:"#e84142",explorerUrl:"https://explorer-xp.avax-test.network/"},i={chainName:"Avalanche Etna P-Devnet",chainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_DEVNET_P,vmName:_models_js__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM,description:"",platformChainId:"",subnetId:"",vmId:"",rpcUrl:"https://etna.avax-dev.network",isTestnet:!0,mainnetChainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.AVALANCHE_DEVNET_P,logoUri:"https://images.ctfassets.net/gcj8jwzm6086/42aMwoCLblHOklt6Msi6tm/1e64aa637a8cead39b2db96fe3225c18/pchain-square.svg",networkToken:{...t,logoUri:"https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/3e4b8ff10b69bfa31e70080a4b142cd0/avalanche-avax-logo.svg"},pricingProviders:{coingecko:{assetPlatformId:"avalanche",nativeTokenId:"avalanche-2"}},primaryColor:"#e84142",explorerUrl:"https://feat-etna-devnet.subnets.pages.dev/p-chain"};var s=(a=>(a.P="avax:Rr9hnPVPxuUvrdCul-vjEsU1zmqKqRDo",a.C="avax:8aDU0Kqh-5d23op-B-r-4YbQFRbsgF9a",a.X="avax:imji8papUf2EhV3le337w1vgFauqkJg-",a.P_TESTNET="avax:Sj7NVE3jXTbJvwFAiu7OEUo_8g8ctXMG",a.C_TESTNET="avax:YRLfeDBJpfEqUWe2FYR1OpXsnDDZeKWd",a.X_TESTNET="avax:8AJTpRj3SAqv1e80Mtl9em08LhvKEbkl",a))(s||{});


/***/ }),

/***/ "./node_modules/@avalabs/core-chains-sdk/esm/bitcoin.chain.js":
/*!********************************************************************!*\
  !*** ./node_modules/@avalabs/core-chains-sdk/esm/bitcoin.chain.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BITCOIN_NETWORK": () => (/* binding */ n),
/* harmony export */   "BITCOIN_TEST_NETWORK": () => (/* binding */ e),
/* harmony export */   "BTC_TOKEN": () => (/* binding */ i),
/* harmony export */   "BitcoinCaip2ChainId": () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var _models_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models.js */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
const i={name:"Bitcoin",symbol:"BTC",decimals:8,description:"",logoUri:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png"},n={chainName:"Bitcoin",chainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.BITCOIN,networkToken:i,vmName:_models_js__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN,description:"",platformChainId:"",subnetId:"",vmId:"",rpcUrl:"",isTestnet:!1,mainnetChainId:"btc",logoUri:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png",pricingProviders:{coingecko:{nativeTokenId:"bitcoin"}},primaryColor:"#ffbb11",explorerUrl:"https://www.blockchain.com/btc"},e={chainName:"Bitcoin Testnet",chainId:_models_js__WEBPACK_IMPORTED_MODULE_0__.ChainId.BITCOIN_TESTNET,networkToken:i,vmName:_models_js__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN,description:"",platformChainId:"",subnetId:"",vmId:"",rpcUrl:"",isTestnet:!0,mainnetChainId:"btc",logoUri:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png",pricingProviders:{coingecko:{nativeTokenId:"bitcoin"}},primaryColor:"#ffbb11",explorerUrl:"https://www.blockchain.com/btc-testnet"};var c=(t=>(t.MAINNET="bip122:000000000019d6689c085ae165831e93",t.TESTNET="bip122:000000000933ea01ad0ee984209779ba",t))(c||{});


/***/ }),

/***/ "./node_modules/@avalabs/core-chains-sdk/esm/models.js":
/*!*************************************************************!*\
  !*** ./node_modules/@avalabs/core-chains-sdk/esm/models.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BlockchainNamespace": () => (/* binding */ T),
/* harmony export */   "ChainId": () => (/* binding */ E),
/* harmony export */   "MAX_SAFE_CHAIN_ID": () => (/* binding */ f),
/* harmony export */   "NetworkVMType": () => (/* binding */ A)
/* harmony export */ });
const f=0xfffffffffffec;var E=(f=>(f[f.AVALANCHE_MAINNET_ID=43114]="AVALANCHE_MAINNET_ID",f[f.AVALANCHE_TESTNET_ID=43113]="AVALANCHE_TESTNET_ID",f[f.AVALANCHE_DEVNET_ID=43117]="AVALANCHE_DEVNET_ID",f[f.AVALANCHE_LOCAL_ID=43112]="AVALANCHE_LOCAL_ID",f[f.ETHEREUM_HOMESTEAD=1]="ETHEREUM_HOMESTEAD",f[f.ETHEREUM_TEST_RINKEBY=4]="ETHEREUM_TEST_RINKEBY",f[f.ETHEREUM_TEST_GOERLY=5]="ETHEREUM_TEST_GOERLY",f[f.ETHEREUM_TEST_SEPOLIA=11155111]="ETHEREUM_TEST_SEPOLIA",f[f.BITCOIN=0xfffffffffffeb]="BITCOIN",f[f.BITCOIN_TESTNET=0xfffffffffffea]="BITCOIN_TESTNET",f[f.SWIMMER=73772]="SWIMMER",f[f.SWIMMER_TESTNET=73771]="SWIMMER_TESTNET",f[f.DFK=53935]="DFK",f[f.DFK_TESTNET=335]="DFK_TESTNET",f[f.WAGMI_TESTNET=11111]="WAGMI_TESTNET",f[f.DEXALOT_TESTNET=432201]="DEXALOT_TESTNET",f[f.AVALANCHE_XP=0xfffffffffffe9]="AVALANCHE_XP",f[f.AVALANCHE_TEST_XP=0xfffffffffffe8]="AVALANCHE_TEST_XP",f[f.AVALANCHE_P=0xfffffffffffe7]="AVALANCHE_P",f[f.AVALANCHE_TEST_P=0xfffffffffffe6]="AVALANCHE_TEST_P",f[f.AVALANCHE_X=0xfffffffffffe5]="AVALANCHE_X",f[f.AVALANCHE_TEST_X=0xfffffffffffe4]="AVALANCHE_TEST_X",f[f.AVALANCHE_DEVNET_P=0xfffffffffffe2]="AVALANCHE_DEVNET_P",f[f.AVALANCHE_DEVNET_X=0xfffffffffffe0]="AVALANCHE_DEVNET_X",f[f.SOLANA_MAINNET_ID=0xffffffffffc04]="SOLANA_MAINNET_ID",f[f.SOLANA_DEVNET_ID=0xffffffffffbfa]="SOLANA_DEVNET_ID",f[f.SOLANA_TESTNET_ID=0xffffffffffbf0]="SOLANA_TESTNET_ID",f))(E||{}),A=(f=>(f.EVM="EVM",f.BITCOIN="BITCOIN",f.AVM="AVM",f.PVM="PVM",f.CoreEth="CoreEth",f.HVM="HVM",f.SVM="SVM",f))(A||{}),T=(f=>(f.EIP155="eip155",f.AVAX="avax",f.BIP122="bip122",f))(T||{});


/***/ }),

/***/ "./node_modules/@avalabs/svm-module/node_modules/@avalabs/core-chains-sdk/esm/solana.chain.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/@avalabs/svm-module/node_modules/@avalabs/core-chains-sdk/esm/solana.chain.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SolanaCaip2ChainId": () => (/* binding */ a)
/* harmony export */ });
var a=(a=>(a.MAINNET="solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",a.DEVNET="solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",a.TESTNET="solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",a))(a||{});


/***/ }),

/***/ "./node_modules/assert/build/assert.js":
/*!*********************************************!*\
  !*** ./node_modules/assert/build/assert.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! ./node_modules/process/browser.js */ "./node_modules/process/browser.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
// Currently in sync with Node.js lib/assert.js
// https://github.com/nodejs/node/commit/2a51ae424a513ec9a6aa3466baa0cc1d55dd4f3b
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(/*! ./internal/errors */ "./node_modules/assert/build/internal/errors.js"),
    _require$codes = _require.codes,
    ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE,
    ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;

var AssertionError = __webpack_require__(/*! ./internal/assert/assertion_error */ "./node_modules/assert/build/internal/assert/assertion_error.js");

var _require2 = __webpack_require__(/*! util/ */ "./node_modules/util/util.js"),
    inspect = _require2.inspect;

var _require$types = (__webpack_require__(/*! util/ */ "./node_modules/util/util.js").types),
    isPromise = _require$types.isPromise,
    isRegExp = _require$types.isRegExp;

var objectAssign = Object.assign ? Object.assign : (__webpack_require__(/*! es6-object-assign */ "./node_modules/es6-object-assign/index.js").assign);
var objectIs = Object.is ? Object.is : __webpack_require__(/*! object-is */ "./node_modules/object-is/index.js");
var errorCache = new Map();
var isDeepEqual;
var isDeepStrictEqual;
var parseExpressionAt;
var findNodeAround;
var decoder;

function lazyLoadComparison() {
  var comparison = __webpack_require__(/*! ./internal/util/comparisons */ "./node_modules/assert/build/internal/util/comparisons.js");

  isDeepEqual = comparison.isDeepEqual;
  isDeepStrictEqual = comparison.isDeepStrictEqual;
} // Escape control characters but not \n and \t to keep the line breaks and
// indentation intact.
// eslint-disable-next-line no-control-regex


var escapeSequencesRegExp = /[\x00-\x08\x0b\x0c\x0e-\x1f]/g;
var meta = ["\\u0000", "\\u0001", "\\u0002", "\\u0003", "\\u0004", "\\u0005", "\\u0006", "\\u0007", '\\b', '', '', "\\u000b", '\\f', '', "\\u000e", "\\u000f", "\\u0010", "\\u0011", "\\u0012", "\\u0013", "\\u0014", "\\u0015", "\\u0016", "\\u0017", "\\u0018", "\\u0019", "\\u001a", "\\u001b", "\\u001c", "\\u001d", "\\u001e", "\\u001f"];

var escapeFn = function escapeFn(str) {
  return meta[str.charCodeAt(0)];
};

var warned = false; // The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;
var NO_EXCEPTION_SENTINEL = {}; // All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided. All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function innerFail(obj) {
  if (obj.message instanceof Error) throw obj.message;
  throw new AssertionError(obj);
}

function fail(actual, expected, message, operator, stackStartFn) {
  var argsLen = arguments.length;
  var internalMessage;

  if (argsLen === 0) {
    internalMessage = 'Failed';
  } else if (argsLen === 1) {
    message = actual;
    actual = undefined;
  } else {
    if (warned === false) {
      warned = true;
      var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
      warn('assert.fail() with more than one argument is deprecated. ' + 'Please use assert.strictEqual() instead or only pass a message.', 'DeprecationWarning', 'DEP0094');
    }

    if (argsLen === 2) operator = '!=';
  }

  if (message instanceof Error) throw message;
  var errArgs = {
    actual: actual,
    expected: expected,
    operator: operator === undefined ? 'fail' : operator,
    stackStartFn: stackStartFn || fail
  };

  if (message !== undefined) {
    errArgs.message = message;
  }

  var err = new AssertionError(errArgs);

  if (internalMessage) {
    err.message = internalMessage;
    err.generatedMessage = true;
  }

  throw err;
}

assert.fail = fail; // The AssertionError is defined in internal/error.

assert.AssertionError = AssertionError;

function innerOk(fn, argLen, value, message) {
  if (!value) {
    var generatedMessage = false;

    if (argLen === 0) {
      generatedMessage = true;
      message = 'No value argument passed to `assert.ok()`';
    } else if (message instanceof Error) {
      throw message;
    }

    var err = new AssertionError({
      actual: value,
      expected: true,
      message: message,
      operator: '==',
      stackStartFn: fn
    });
    err.generatedMessage = generatedMessage;
    throw err;
  }
} // Pure assertion tests whether a value is truthy, as determined
// by !!value.


function ok() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  innerOk.apply(void 0, [ok, args.length].concat(args));
}

assert.ok = ok; // The equality assertion tests shallow, coercive equality with ==.

/* eslint-disable no-restricted-properties */

assert.equal = function equal(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual != expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '==',
      stackStartFn: equal
    });
  }
}; // The non-equality assertion tests for whether two objects are not
// equal with !=.


assert.notEqual = function notEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  } // eslint-disable-next-line eqeqeq


  if (actual == expected) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: '!=',
      stackStartFn: notEqual
    });
  }
}; // The equivalence assertion tests a deep equality relation.


assert.deepEqual = function deepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepEqual',
      stackStartFn: deepEqual
    });
  }
}; // The non-equivalence assertion tests for any deep inequality.


assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepEqual',
      stackStartFn: notDeepEqual
    });
  }
};
/* eslint-enable */


assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (!isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'deepStrictEqual',
      stackStartFn: deepStrictEqual
    });
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;

function notDeepStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (isDeepEqual === undefined) lazyLoadComparison();

  if (isDeepStrictEqual(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notDeepStrictEqual',
      stackStartFn: notDeepStrictEqual
    });
  }
}

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (!objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'strictEqual',
      stackStartFn: strictEqual
    });
  }
};

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (arguments.length < 2) {
    throw new ERR_MISSING_ARGS('actual', 'expected');
  }

  if (objectIs(actual, expected)) {
    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: 'notStrictEqual',
      stackStartFn: notStrictEqual
    });
  }
};

var Comparison = function Comparison(obj, keys, actual) {
  var _this = this;

  _classCallCheck(this, Comparison);

  keys.forEach(function (key) {
    if (key in obj) {
      if (actual !== undefined && typeof actual[key] === 'string' && isRegExp(obj[key]) && obj[key].test(actual[key])) {
        _this[key] = actual[key];
      } else {
        _this[key] = obj[key];
      }
    }
  });
};

function compareExceptionKey(actual, expected, key, message, keys, fn) {
  if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
    if (!message) {
      // Create placeholder objects to create a nice output.
      var a = new Comparison(actual, keys);
      var b = new Comparison(expected, keys, actual);
      var err = new AssertionError({
        actual: a,
        expected: b,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.actual = actual;
      err.expected = expected;
      err.operator = fn.name;
      throw err;
    }

    innerFail({
      actual: actual,
      expected: expected,
      message: message,
      operator: fn.name,
      stackStartFn: fn
    });
  }
}

function expectedException(actual, expected, msg, fn) {
  if (typeof expected !== 'function') {
    if (isRegExp(expected)) return expected.test(actual); // assert.doesNotThrow does not accept objects.

    if (arguments.length === 2) {
      throw new ERR_INVALID_ARG_TYPE('expected', ['Function', 'RegExp'], expected);
    } // Handle primitives properly.


    if (_typeof(actual) !== 'object' || actual === null) {
      var err = new AssertionError({
        actual: actual,
        expected: expected,
        message: msg,
        operator: 'deepStrictEqual',
        stackStartFn: fn
      });
      err.operator = fn.name;
      throw err;
    }

    var keys = Object.keys(expected); // Special handle errors to make sure the name and the message are compared
    // as well.

    if (expected instanceof Error) {
      keys.push('name', 'message');
    } else if (keys.length === 0) {
      throw new ERR_INVALID_ARG_VALUE('error', expected, 'may not be an empty object');
    }

    if (isDeepEqual === undefined) lazyLoadComparison();
    keys.forEach(function (key) {
      if (typeof actual[key] === 'string' && isRegExp(expected[key]) && expected[key].test(actual[key])) {
        return;
      }

      compareExceptionKey(actual, expected, key, msg, keys, fn);
    });
    return true;
  } // Guard instanceof against arrow functions as they don't have a prototype.


  if (expected.prototype !== undefined && actual instanceof expected) {
    return true;
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function getActual(fn) {
  if (typeof fn !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('fn', 'Function', fn);
  }

  try {
    fn();
  } catch (e) {
    return e;
  }

  return NO_EXCEPTION_SENTINEL;
}

function checkIsPromise(obj) {
  // Accept native ES6 promises and promises that are implemented in a similar
  // way. Do not accept thenables that use a function as `obj` and that have no
  // `catch` handler.
  // TODO: thenables are checked up until they have the correct methods,
  // but according to documentation, the `then` method should receive
  // the `fulfill` and `reject` arguments as well or it may be never resolved.
  return isPromise(obj) || obj !== null && _typeof(obj) === 'object' && typeof obj.then === 'function' && typeof obj.catch === 'function';
}

function waitForActual(promiseFn) {
  return Promise.resolve().then(function () {
    var resultPromise;

    if (typeof promiseFn === 'function') {
      // Return a rejected promise if `promiseFn` throws synchronously.
      resultPromise = promiseFn(); // Fail in case no promise is returned.

      if (!checkIsPromise(resultPromise)) {
        throw new ERR_INVALID_RETURN_VALUE('instance of Promise', 'promiseFn', resultPromise);
      }
    } else if (checkIsPromise(promiseFn)) {
      resultPromise = promiseFn;
    } else {
      throw new ERR_INVALID_ARG_TYPE('promiseFn', ['Function', 'Promise'], promiseFn);
    }

    return Promise.resolve().then(function () {
      return resultPromise;
    }).then(function () {
      return NO_EXCEPTION_SENTINEL;
    }).catch(function (e) {
      return e;
    });
  });
}

function expectsError(stackStartFn, actual, error, message) {
  if (typeof error === 'string') {
    if (arguments.length === 4) {
      throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
    }

    if (_typeof(actual) === 'object' && actual !== null) {
      if (actual.message === error) {
        throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error message \"".concat(actual.message, "\" is identical to the message."));
      }
    } else if (actual === error) {
      throw new ERR_AMBIGUOUS_ARGUMENT('error/message', "The error \"".concat(actual, "\" is identical to the message."));
    }

    message = error;
    error = undefined;
  } else if (error != null && _typeof(error) !== 'object' && typeof error !== 'function') {
    throw new ERR_INVALID_ARG_TYPE('error', ['Object', 'Error', 'Function', 'RegExp'], error);
  }

  if (actual === NO_EXCEPTION_SENTINEL) {
    var details = '';

    if (error && error.name) {
      details += " (".concat(error.name, ")");
    }

    details += message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'rejects' ? 'rejection' : 'exception';
    innerFail({
      actual: undefined,
      expected: error,
      operator: stackStartFn.name,
      message: "Missing expected ".concat(fnType).concat(details),
      stackStartFn: stackStartFn
    });
  }

  if (error && !expectedException(actual, error, message, stackStartFn)) {
    throw actual;
  }
}

function expectsNoError(stackStartFn, actual, error, message) {
  if (actual === NO_EXCEPTION_SENTINEL) return;

  if (typeof error === 'string') {
    message = error;
    error = undefined;
  }

  if (!error || expectedException(actual, error)) {
    var details = message ? ": ".concat(message) : '.';
    var fnType = stackStartFn.name === 'doesNotReject' ? 'rejection' : 'exception';
    innerFail({
      actual: actual,
      expected: error,
      operator: stackStartFn.name,
      message: "Got unwanted ".concat(fnType).concat(details, "\n") + "Actual message: \"".concat(actual && actual.message, "\""),
      stackStartFn: stackStartFn
    });
  }

  throw actual;
}

assert.throws = function throws(promiseFn) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
};

assert.rejects = function rejects(promiseFn) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }

  return waitForActual(promiseFn).then(function (result) {
    return expectsError.apply(void 0, [rejects, result].concat(args));
  });
};

assert.doesNotThrow = function doesNotThrow(fn) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
};

assert.doesNotReject = function doesNotReject(fn) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  return waitForActual(fn).then(function (result) {
    return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
  });
};

assert.ifError = function ifError(err) {
  if (err !== null && err !== undefined) {
    var message = 'ifError got unwanted exception: ';

    if (_typeof(err) === 'object' && typeof err.message === 'string') {
      if (err.message.length === 0 && err.constructor) {
        message += err.constructor.name;
      } else {
        message += err.message;
      }
    } else {
      message += inspect(err);
    }

    var newErr = new AssertionError({
      actual: err,
      expected: null,
      operator: 'ifError',
      message: message,
      stackStartFn: ifError
    }); // Make sure we actually have a stack trace!

    var origStack = err.stack;

    if (typeof origStack === 'string') {
      // This will remove any duplicated frames from the error frames taken
      // from within `ifError` and add the original error frames to the newly
      // created ones.
      var tmp2 = origStack.split('\n');
      tmp2.shift(); // Filter all frames existing in err.stack.

      var tmp1 = newErr.stack.split('\n');

      for (var i = 0; i < tmp2.length; i++) {
        // Find the first occurrence of the frame.
        var pos = tmp1.indexOf(tmp2[i]);

        if (pos !== -1) {
          // Only keep new frames.
          tmp1 = tmp1.slice(0, pos);
          break;
        }
      }

      newErr.stack = "".concat(tmp1.join('\n'), "\n").concat(tmp2.join('\n'));
    }

    throw newErr;
  }
}; // Expose a strict only variant of assert


function strict() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  innerOk.apply(void 0, [strict, args.length].concat(args));
}

assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

/***/ }),

/***/ "./node_modules/assert/build/internal/assert/assertion_error.js":
/*!**********************************************************************!*\
  !*** ./node_modules/assert/build/internal/assert/assertion_error.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! ./node_modules/process/browser.js */ "./node_modules/process/browser.js");
// Currently in sync with Node.js lib/internal/assert/assertion_error.js
// https://github.com/nodejs/node/commit/0817840f775032169ddd70c85ac059f18ffcc81c


function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(/*! util/ */ "./node_modules/util/util.js"),
    inspect = _require.inspect;

var _require2 = __webpack_require__(/*! ../errors */ "./node_modules/assert/build/internal/errors.js"),
    ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat


function repeat(str, count) {
  count = Math.floor(count);
  if (str.length == 0 || count == 0) return '';
  var maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));

  while (count) {
    str += str;
    count--;
  }

  str += str.substring(0, maxCount - str.length);
  return str;
}

var blue = '';
var green = '';
var red = '';
var white = '';
var kReadableOperator = {
  deepStrictEqual: 'Expected values to be strictly deep-equal:',
  strictEqual: 'Expected values to be strictly equal:',
  strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
  deepEqual: 'Expected values to be loosely deep-equal:',
  equal: 'Expected values to be loosely equal:',
  notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
  notStrictEqual: 'Expected "actual" to be strictly unequal to:',
  notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
  notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
  notEqual: 'Expected "actual" to be loosely unequal to:',
  notIdentical: 'Values identical but not reference-equal:'
}; // Comparing short primitives should just show === / !== instead of using the
// diff.

var kMaxShortLength = 10;

function copyError(source) {
  var keys = Object.keys(source);
  var target = Object.create(Object.getPrototypeOf(source));
  keys.forEach(function (key) {
    target[key] = source[key];
  });
  Object.defineProperty(target, 'message', {
    value: source.message
  });
  return target;
}

function inspectValue(val) {
  // The util.inspect default values could be changed. This makes sure the
  // error messages contain the necessary information nevertheless.
  return inspect(val, {
    compact: false,
    customInspect: false,
    depth: 1000,
    maxArrayLength: Infinity,
    // Assert compares only enumerable properties (with a few exceptions).
    showHidden: false,
    // Having a long line as error is better than wrapping the line for
    // comparison for now.
    // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
    // have meta information about the inspected properties (i.e., know where
    // in what line the property starts and ends).
    breakLength: Infinity,
    // Assert does not detect proxies currently.
    showProxy: false,
    sorted: true,
    // Inspect getters as we also check them when comparing entries.
    getters: true
  });
}

function createErrDiff(actual, expected, operator) {
  var other = '';
  var res = '';
  var lastPos = 0;
  var end = '';
  var skipped = false;
  var actualInspected = inspectValue(actual);
  var actualLines = actualInspected.split('\n');
  var expectedLines = inspectValue(expected).split('\n');
  var i = 0;
  var indicator = ''; // In case both values are objects explicitly mark them as not reference equal
  // for the `strictEqual` operator.

  if (operator === 'strictEqual' && _typeof(actual) === 'object' && _typeof(expected) === 'object' && actual !== null && expected !== null) {
    operator = 'strictEqualObject';
  } // If "actual" and "expected" fit on a single line and they are not strictly
  // equal, check further special handling.


  if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
    var inputLength = actualLines[0].length + expectedLines[0].length; // If the character length of "actual" and "expected" together is less than
    // kMaxShortLength and if neither is an object and at least one of them is
    // not `zero`, use the strict equal comparison to visualize the output.

    if (inputLength <= kMaxShortLength) {
      if ((_typeof(actual) !== 'object' || actual === null) && (_typeof(expected) !== 'object' || expected === null) && (actual !== 0 || expected !== 0)) {
        // -0 === +0
        return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
      }
    } else if (operator !== 'strictEqualObject') {
      // If the stderr is a tty and the input length is lower than the current
      // columns per line, add a mismatch indicator below the output. If it is
      // not a tty, use a default value of 80 characters.
      var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;

      if (inputLength < maxLength) {
        while (actualLines[0][i] === expectedLines[0][i]) {
          i++;
        } // Ignore the first characters.


        if (i > 2) {
          // Add position indicator for the first mismatch in case it is a
          // single line and the input length is less than the column length.
          indicator = "\n  ".concat(repeat(' ', i), "^");
          i = 0;
        }
      }
    }
  } // Remove all ending lines that match (this optimizes the output for
  // readability by reducing the number of total changed lines).


  var a = actualLines[actualLines.length - 1];
  var b = expectedLines[expectedLines.length - 1];

  while (a === b) {
    if (i++ < 2) {
      end = "\n  ".concat(a).concat(end);
    } else {
      other = a;
    }

    actualLines.pop();
    expectedLines.pop();
    if (actualLines.length === 0 || expectedLines.length === 0) break;
    a = actualLines[actualLines.length - 1];
    b = expectedLines[expectedLines.length - 1];
  }

  var maxLines = Math.max(actualLines.length, expectedLines.length); // Strict equal with identical objects that are not identical by reference.
  // E.g., assert.deepStrictEqual({ a: Symbol() }, { a: Symbol() })

  if (maxLines === 0) {
    // We have to get the result again. The lines were all removed before.
    var _actualLines = actualInspected.split('\n'); // Only remove lines in case it makes sense to collapse those.
    // TODO: Accept env to always show the full error.


    if (_actualLines.length > 30) {
      _actualLines[26] = "".concat(blue, "...").concat(white);

      while (_actualLines.length > 27) {
        _actualLines.pop();
      }
    }

    return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join('\n'), "\n");
  }

  if (i > 3) {
    end = "\n".concat(blue, "...").concat(white).concat(end);
    skipped = true;
  }

  if (other !== '') {
    end = "\n  ".concat(other).concat(end);
    other = '';
  }

  var printedLines = 0;
  var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
  var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");

  for (i = 0; i < maxLines; i++) {
    // Only extra expected lines exist
    var cur = i - lastPos;

    if (actualLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(expectedLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(expectedLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the expected line to the cache.

      other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
      printedLines++; // Only extra actual lines exist
    } else if (expectedLines.length < i + 1) {
      // If the last diverging line is more than one line above and the
      // current line is at least line three, add some of the former lines and
      // also add dots to indicate skipped entries.
      if (cur > 1 && i > 2) {
        if (cur > 4) {
          res += "\n".concat(blue, "...").concat(white);
          skipped = true;
        } else if (cur > 3) {
          res += "\n  ".concat(actualLines[i - 2]);
          printedLines++;
        }

        res += "\n  ".concat(actualLines[i - 1]);
        printedLines++;
      } // Mark the current line as the last diverging one.


      lastPos = i; // Add the actual line to the result.

      res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
      printedLines++; // Lines diverge
    } else {
      var expectedLine = expectedLines[i];
      var actualLine = actualLines[i]; // If the lines diverge, specifically check for lines that only diverge by
      // a trailing comma. In that case it is actually identical and we should
      // mark it as such.

      var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ',') || actualLine.slice(0, -1) !== expectedLine); // If the expected line has a trailing comma but is otherwise identical,
      // add a comma at the end of the actual line. Otherwise the output could
      // look weird as in:
      //
      //   [
      //     1         // No comma at the end!
      // +   2
      //   ]
      //

      if (divergingLines && endsWith(expectedLine, ',') && expectedLine.slice(0, -1) === actualLine) {
        divergingLines = false;
        actualLine += ',';
      }

      if (divergingLines) {
        // If the last diverging line is more than one line above and the
        // current line is at least line three, add some of the former lines and
        // also add dots to indicate skipped entries.
        if (cur > 1 && i > 2) {
          if (cur > 4) {
            res += "\n".concat(blue, "...").concat(white);
            skipped = true;
          } else if (cur > 3) {
            res += "\n  ".concat(actualLines[i - 2]);
            printedLines++;
          }

          res += "\n  ".concat(actualLines[i - 1]);
          printedLines++;
        } // Mark the current line as the last diverging one.


        lastPos = i; // Add the actual line to the result and cache the expected diverging
        // line so consecutive diverging lines show up as +++--- and not +-+-+-.

        res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
        other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
        printedLines += 2; // Lines are identical
      } else {
        // Add all cached information to the result before adding other things
        // and reset the cache.
        res += other;
        other = ''; // If the last diverging line is exactly one line above or if it is the
        // very first line, add the line to the result.

        if (cur === 1 || i === 0) {
          res += "\n  ".concat(actualLine);
          printedLines++;
        }
      }
    } // Inspected object to big (Show ~20 rows max)


    if (printedLines > 20 && i < maxLines - 2) {
      return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
    }
  }

  return "".concat(msg).concat(skipped ? skippedMsg : '', "\n").concat(res).concat(other).concat(end).concat(indicator);
}

var AssertionError =
/*#__PURE__*/
function (_Error) {
  _inherits(AssertionError, _Error);

  function AssertionError(options) {
    var _this;

    _classCallCheck(this, AssertionError);

    if (_typeof(options) !== 'object' || options === null) {
      throw new ERR_INVALID_ARG_TYPE('options', 'Object', options);
    }

    var message = options.message,
        operator = options.operator,
        stackStartFn = options.stackStartFn;
    var actual = options.actual,
        expected = options.expected;
    var limit = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;

    if (message != null) {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, String(message)));
    } else {
      if (process.stderr && process.stderr.isTTY) {
        // Reset on each call to make sure we handle dynamically set environment
        // variables correct.
        if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
          blue = "\x1B[34m";
          green = "\x1B[32m";
          white = "\x1B[39m";
          red = "\x1B[31m";
        } else {
          blue = '';
          green = '';
          white = '';
          red = '';
        }
      } // Prevent the error stack from being visible by duplicating the error
      // in a very close way to the original in case both sides are actually
      // instances of Error.


      if (_typeof(actual) === 'object' && actual !== null && _typeof(expected) === 'object' && expected !== null && 'stack' in actual && actual instanceof Error && 'stack' in expected && expected instanceof Error) {
        actual = copyError(actual);
        expected = copyError(expected);
      }

      if (operator === 'deepStrictEqual' || operator === 'strictEqual') {
        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, createErrDiff(actual, expected, operator)));
      } else if (operator === 'notDeepStrictEqual' || operator === 'notStrictEqual') {
        // In case the objects are equal but the operator requires unequal, show
        // the first object and say A equals B
        var base = kReadableOperator[operator];
        var res = inspectValue(actual).split('\n'); // In case "actual" is an object, it should not be reference equal.

        if (operator === 'notStrictEqual' && _typeof(actual) === 'object' && actual !== null) {
          base = kReadableOperator.notStrictEqualObject;
        } // Only remove lines in case it makes sense to collapse those.
        // TODO: Accept env to always show the full error.


        if (res.length > 30) {
          res[26] = "".concat(blue, "...").concat(white);

          while (res.length > 27) {
            res.pop();
          }
        } // Only print a single input.


        if (res.length === 1) {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, " ").concat(res[0])));
        } else {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(base, "\n\n").concat(res.join('\n'), "\n")));
        }
      } else {
        var _res = inspectValue(actual);

        var other = '';
        var knownOperators = kReadableOperator[operator];

        if (operator === 'notDeepEqual' || operator === 'notEqual') {
          _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);

          if (_res.length > 1024) {
            _res = "".concat(_res.slice(0, 1021), "...");
          }
        } else {
          other = "".concat(inspectValue(expected));

          if (_res.length > 512) {
            _res = "".concat(_res.slice(0, 509), "...");
          }

          if (other.length > 512) {
            other = "".concat(other.slice(0, 509), "...");
          }

          if (operator === 'deepEqual' || operator === 'equal') {
            _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
          } else {
            other = " ".concat(operator, " ").concat(other);
          }
        }

        _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError).call(this, "".concat(_res).concat(other)));
      }
    }

    Error.stackTraceLimit = limit;
    _this.generatedMessage = !message;
    Object.defineProperty(_assertThisInitialized(_this), 'name', {
      value: 'AssertionError [ERR_ASSERTION]',
      enumerable: false,
      writable: true,
      configurable: true
    });
    _this.code = 'ERR_ASSERTION';
    _this.actual = actual;
    _this.expected = expected;
    _this.operator = operator;

    if (Error.captureStackTrace) {
      // eslint-disable-next-line no-restricted-syntax
      Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
    } // Create error message including the error code in the name.


    _this.stack; // Reset the name.

    _this.name = 'AssertionError';
    return _possibleConstructorReturn(_this);
  }

  _createClass(AssertionError, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
    }
  }, {
    key: inspect.custom,
    value: function value(recurseTimes, ctx) {
      // This limits the `actual` and `expected` property default inspection to
      // the minimum depth. Otherwise those values would be too verbose compared
      // to the actual error message which contains a combined view of these two
      // input values.
      return inspect(this, _objectSpread({}, ctx, {
        customInspect: false,
        depth: 0
      }));
    }
  }]);

  return AssertionError;
}(_wrapNativeSuper(Error));

module.exports = AssertionError;

/***/ }),

/***/ "./node_modules/assert/build/internal/errors.js":
/*!******************************************************!*\
  !*** ./node_modules/assert/build/internal/errors.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/errors.js
// https://github.com/nodejs/node/commit/3b044962c48fe313905877a96b5d0894a5404f6f

/* eslint node-core/documented-errors: "error" */

/* eslint node-core/alphabetize-errors: "error" */

/* eslint node-core/prefer-util-format-errors: "error" */
 // The whole point behind this internal module is to allow Node.js to no
// longer be forced to treat every error message change as a semver-major
// change. The NodeError classes here all expose a `code` property whose
// value statically and permanently identifies the error. While the error
// message may change, the code should not.

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var codes = {}; // Lazy loaded

var assert;
var util;

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage(arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message;
    } else {
      return message(arg1, arg2, arg3);
    }
  }

  var NodeError =
  /*#__PURE__*/
  function (_Base) {
    _inherits(NodeError, _Base);

    function NodeError(arg1, arg2, arg3) {
      var _this;

      _classCallCheck(this, NodeError);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeError).call(this, getMessage(arg1, arg2, arg3)));
      _this.code = code;
      return _this;
    }

    return NodeError;
  }(Base);

  codes[code] = NodeError;
} // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js


function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    expected = expected.map(function (i) {
      return String(i);
    });

    if (len > 2) {
      return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(', '), ", or ") + expected[len - 1];
    } else if (len === 2) {
      return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
    } else {
      return "of ".concat(thing, " ").concat(expected[0]);
    }
  } else {
    return "of ".concat(thing, " ").concat(String(expected));
  }
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith


function startsWith(str, search, pos) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith


function endsWith(str, search, this_len) {
  if (this_len === undefined || this_len > str.length) {
    this_len = str.length;
  }

  return str.substring(this_len - search.length, this_len) === search;
} // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes


function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_AMBIGUOUS_ARGUMENT', 'The "%s" argument is ambiguous. %s', TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  if (assert === undefined) assert = __webpack_require__(/*! ../assert */ "./node_modules/assert/build/assert.js");
  assert(typeof name === 'string', "'name' must be a string"); // determiner: 'must be' or 'must not be'

  var determiner;

  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  var msg;

  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } else {
    var type = includes(name, '.') ? 'property' : 'argument';
    msg = "The \"".concat(name, "\" ").concat(type, " ").concat(determiner, " ").concat(oneOf(expected, 'type'));
  } // TODO(BridgeAR): Improve the output by showing `null` and similar.


  msg += ". Received type ".concat(_typeof(actual));
  return msg;
}, TypeError);
createErrorType('ERR_INVALID_ARG_VALUE', function (name, value) {
  var reason = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is invalid';
  if (util === undefined) util = __webpack_require__(/*! util/ */ "./node_modules/util/util.js");
  var inspected = util.inspect(value);

  if (inspected.length > 128) {
    inspected = "".concat(inspected.slice(0, 128), "...");
  }

  return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
}, TypeError, RangeError);
createErrorType('ERR_INVALID_RETURN_VALUE', function (input, name, value) {
  var type;

  if (value && value.constructor && value.constructor.name) {
    type = "instance of ".concat(value.constructor.name);
  } else {
    type = "type ".concat(_typeof(value));
  }

  return "Expected ".concat(input, " to be returned from the \"").concat(name, "\"") + " function but got ".concat(type, ".");
}, TypeError);
createErrorType('ERR_MISSING_ARGS', function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (assert === undefined) assert = __webpack_require__(/*! ../assert */ "./node_modules/assert/build/assert.js");
  assert(args.length > 0, 'At least one arg needs to be specified');
  var msg = 'The ';
  var len = args.length;
  args = args.map(function (a) {
    return "\"".concat(a, "\"");
  });

  switch (len) {
    case 1:
      msg += "".concat(args[0], " argument");
      break;

    case 2:
      msg += "".concat(args[0], " and ").concat(args[1], " arguments");
      break;

    default:
      msg += args.slice(0, len - 1).join(', ');
      msg += ", and ".concat(args[len - 1], " arguments");
      break;
  }

  return "".concat(msg, " must be specified");
}, TypeError);
module.exports.codes = codes;

/***/ }),

/***/ "./node_modules/assert/build/internal/util/comparisons.js":
/*!****************************************************************!*\
  !*** ./node_modules/assert/build/internal/util/comparisons.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/util/comparisons.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var regexFlagsSupported = /a/g.flags !== undefined;

var arrayFromSet = function arrayFromSet(set) {
  var array = [];
  set.forEach(function (value) {
    return array.push(value);
  });
  return array;
};

var arrayFromMap = function arrayFromMap(map) {
  var array = [];
  map.forEach(function (value, key) {
    return array.push([key, value]);
  });
  return array;
};

var objectIs = Object.is ? Object.is : __webpack_require__(/*! object-is */ "./node_modules/object-is/index.js");
var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function () {
  return [];
};
var numberIsNaN = Number.isNaN ? Number.isNaN : __webpack_require__(/*! is-nan */ "./node_modules/is-nan/index.js");

function uncurryThis(f) {
  return f.call.bind(f);
}

var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
var objectToString = uncurryThis(Object.prototype.toString);

var _require$types = (__webpack_require__(/*! util/ */ "./node_modules/util/util.js").types),
    isAnyArrayBuffer = _require$types.isAnyArrayBuffer,
    isArrayBufferView = _require$types.isArrayBufferView,
    isDate = _require$types.isDate,
    isMap = _require$types.isMap,
    isRegExp = _require$types.isRegExp,
    isSet = _require$types.isSet,
    isNativeError = _require$types.isNativeError,
    isBoxedPrimitive = _require$types.isBoxedPrimitive,
    isNumberObject = _require$types.isNumberObject,
    isStringObject = _require$types.isStringObject,
    isBooleanObject = _require$types.isBooleanObject,
    isBigIntObject = _require$types.isBigIntObject,
    isSymbolObject = _require$types.isSymbolObject,
    isFloat32Array = _require$types.isFloat32Array,
    isFloat64Array = _require$types.isFloat64Array;

function isNonIndex(key) {
  if (key.length === 0 || key.length > 10) return true;

  for (var i = 0; i < key.length; i++) {
    var code = key.charCodeAt(i);
    if (code < 48 || code > 57) return true;
  } // The maximum size for an array is 2 ** 32 -1.


  return key.length === 10 && key >= Math.pow(2, 32);
}

function getOwnNonIndexProperties(value) {
  return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
} // Taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */


function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }

  if (y < x) {
    return 1;
  }

  return 0;
}

var ONLY_ENUMERABLE = undefined;
var kStrict = true;
var kLoose = false;
var kNoIterator = 0;
var kIsArray = 1;
var kIsSet = 2;
var kIsMap = 3; // Check if they have the same source and flags

function areSimilarRegExps(a, b) {
  return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
}

function areSimilarFloatArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  for (var offset = 0; offset < a.byteLength; offset++) {
    if (a[offset] !== b[offset]) {
      return false;
    }
  }

  return true;
}

function areSimilarTypedArrays(a, b) {
  if (a.byteLength !== b.byteLength) {
    return false;
  }

  return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
}

function areEqualArrayBuffers(buf1, buf2) {
  return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
}

function isEqualBoxedPrimitive(val1, val2) {
  if (isNumberObject(val1)) {
    return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
  }

  if (isStringObject(val1)) {
    return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
  }

  if (isBooleanObject(val1)) {
    return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
  }

  if (isBigIntObject(val1)) {
    return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
  }

  return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
} // Notes: Type tags are historical [[Class]] properties that can be set by
// FunctionTemplate::SetClassName() in C++ or Symbol.toStringTag in JS
// and retrieved using Object.prototype.toString.call(obj) in JS
// See https://tc39.github.io/ecma262/#sec-object.prototype.tostring
// for a list of tags pre-defined in the spec.
// There are some unspecified tags in the wild too (e.g. typed array tags).
// Since tags can be altered, they only serve fast failures
//
// Typed arrays and buffers are checked by comparing the content in their
// underlying ArrayBuffer. This optimization requires that it's
// reasonable to interpret their underlying memory in the same way,
// which is checked by comparing their type tags.
// (e.g. a Uint8Array and a Uint16Array with the same memory content
// could still be different because they will be interpreted differently).
//
// For strict comparison, objects should have
// a) The same built-in type tags
// b) The same prototypes.


function innerDeepEqual(val1, val2, strict, memos) {
  // All identical values are equivalent, as determined by ===.
  if (val1 === val2) {
    if (val1 !== 0) return true;
    return strict ? objectIs(val1, val2) : true;
  } // Check more closely if val1 and val2 are equal.


  if (strict) {
    if (_typeof(val1) !== 'object') {
      return typeof val1 === 'number' && numberIsNaN(val1) && numberIsNaN(val2);
    }

    if (_typeof(val2) !== 'object' || val1 === null || val2 === null) {
      return false;
    }

    if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
      return false;
    }
  } else {
    if (val1 === null || _typeof(val1) !== 'object') {
      if (val2 === null || _typeof(val2) !== 'object') {
        // eslint-disable-next-line eqeqeq
        return val1 == val2;
      }

      return false;
    }

    if (val2 === null || _typeof(val2) !== 'object') {
      return false;
    }
  }

  var val1Tag = objectToString(val1);
  var val2Tag = objectToString(val2);

  if (val1Tag !== val2Tag) {
    return false;
  }

  if (Array.isArray(val1)) {
    // Check for sparse arrays and general fast path
    if (val1.length !== val2.length) {
      return false;
    }

    var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
    var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
  } // [browserify] This triggers on certain types in IE (Map/Set) so we don't
  // wan't to early return out of the rest of the checks. However we can check
  // if the second value is one of these values and the first isn't.


  if (val1Tag === '[object Object]') {
    // return keyCheck(val1, val2, strict, memos, kNoIterator);
    if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
      return false;
    }
  }

  if (isDate(val1)) {
    if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
      return false;
    }
  } else if (isRegExp(val1)) {
    if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
      return false;
    }
  } else if (isNativeError(val1) || val1 instanceof Error) {
    // Do not compare the stack as it might differ even though the error itself
    // is otherwise identical.
    if (val1.message !== val2.message || val1.name !== val2.name) {
      return false;
    }
  } else if (isArrayBufferView(val1)) {
    if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
      if (!areSimilarFloatArrays(val1, val2)) {
        return false;
      }
    } else if (!areSimilarTypedArrays(val1, val2)) {
      return false;
    } // Buffer.compare returns true, so val1.length === val2.length. If they both
    // only contain numeric keys, we don't need to exam further than checking
    // the symbols.


    var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);

    var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);

    if (_keys.length !== _keys2.length) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
  } else if (isSet(val1)) {
    if (!isSet(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsSet);
  } else if (isMap(val1)) {
    if (!isMap(val2) || val1.size !== val2.size) {
      return false;
    }

    return keyCheck(val1, val2, strict, memos, kIsMap);
  } else if (isAnyArrayBuffer(val1)) {
    if (!areEqualArrayBuffers(val1, val2)) {
      return false;
    }
  } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
    return false;
  }

  return keyCheck(val1, val2, strict, memos, kNoIterator);
}

function getEnumerables(val, keys) {
  return keys.filter(function (k) {
    return propertyIsEnumerable(val, k);
  });
}

function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
  // For all remaining Object pairs, including Array, objects and Maps,
  // equivalence is determined by having:
  // a) The same number of owned enumerable properties
  // b) The same set of keys/indexes (although not necessarily the same order)
  // c) Equivalent values for every corresponding key/index
  // d) For Sets and Maps, equal contents
  // Note: this accounts for both named and indexed properties on Arrays.
  if (arguments.length === 5) {
    aKeys = Object.keys(val1);
    var bKeys = Object.keys(val2); // The pair must have the same number of owned properties.

    if (aKeys.length !== bKeys.length) {
      return false;
    }
  } // Cheap key test


  var i = 0;

  for (; i < aKeys.length; i++) {
    if (!hasOwnProperty(val2, aKeys[i])) {
      return false;
    }
  }

  if (strict && arguments.length === 5) {
    var symbolKeysA = objectGetOwnPropertySymbols(val1);

    if (symbolKeysA.length !== 0) {
      var count = 0;

      for (i = 0; i < symbolKeysA.length; i++) {
        var key = symbolKeysA[i];

        if (propertyIsEnumerable(val1, key)) {
          if (!propertyIsEnumerable(val2, key)) {
            return false;
          }

          aKeys.push(key);
          count++;
        } else if (propertyIsEnumerable(val2, key)) {
          return false;
        }
      }

      var symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
        return false;
      }
    } else {
      var _symbolKeysB = objectGetOwnPropertySymbols(val2);

      if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
        return false;
      }
    }
  }

  if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
    return true;
  } // Use memos to handle cycles.


  if (memos === undefined) {
    memos = {
      val1: new Map(),
      val2: new Map(),
      position: 0
    };
  } else {
    // We prevent up to two map.has(x) calls by directly retrieving the value
    // and checking for undefined. The map can only contain numbers, so it is
    // safe to check for undefined only.
    var val2MemoA = memos.val1.get(val1);

    if (val2MemoA !== undefined) {
      var val2MemoB = memos.val2.get(val2);

      if (val2MemoB !== undefined) {
        return val2MemoA === val2MemoB;
      }
    }

    memos.position++;
  }

  memos.val1.set(val1, memos.position);
  memos.val2.set(val2, memos.position);
  var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
  memos.val1.delete(val1);
  memos.val2.delete(val2);
  return areEq;
}

function setHasEqualElement(set, val1, strict, memo) {
  // Go looking.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var val2 = setValues[i];

    if (innerDeepEqual(val1, val2, strict, memo)) {
      // Remove the matching element to make sure we do not check that again.
      set.delete(val2);
      return true;
    }
  }

  return false;
} // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Loose_equality_using
// Sadly it is not possible to detect corresponding values properly in case the
// type is a string, number, bigint or boolean. The reason is that those values
// can match lots of different string values (e.g., 1n == '+00001').


function findLooseMatchingPrimitives(prim) {
  switch (_typeof(prim)) {
    case 'undefined':
      return null;

    case 'object':
      // Only pass in null as object!
      return undefined;

    case 'symbol':
      return false;

    case 'string':
      prim = +prim;
    // Loose equal entries exist only if the string is possible to convert to
    // a regular number and not NaN.
    // Fall through

    case 'number':
      if (numberIsNaN(prim)) {
        return false;
      }

  }

  return true;
}

function setMightHaveLoosePrim(a, b, prim) {
  var altValue = findLooseMatchingPrimitives(prim);
  if (altValue != null) return altValue;
  return b.has(altValue) && !a.has(altValue);
}

function mapMightHaveLoosePrim(a, b, prim, item, memo) {
  var altValue = findLooseMatchingPrimitives(prim);

  if (altValue != null) {
    return altValue;
  }

  var curB = b.get(altValue);

  if (curB === undefined && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
    return false;
  }

  return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
}

function setEquiv(a, b, strict, memo) {
  // This is a lazily initiated Set of entries which have to be compared
  // pairwise.
  var set = null;
  var aValues = arrayFromSet(a);

  for (var i = 0; i < aValues.length; i++) {
    var val = aValues[i]; // Note: Checking for the objects first improves the performance for object
    // heavy sets but it is a minor slow down for primitives. As they are fast
    // to check this improves the worst case scenario instead.

    if (_typeof(val) === 'object' && val !== null) {
      if (set === null) {
        set = new Set();
      } // If the specified value doesn't exist in the second set its an not null
      // object (or non strict only: a not matching primitive) we'll need to go
      // hunting for something thats deep-(strict-)equal to it. To make this
      // O(n log n) complexity we have to copy these values in a new set first.


      set.add(val);
    } else if (!b.has(val)) {
      if (strict) return false; // Fast path to detect missing string, symbol, undefined and null values.

      if (!setMightHaveLoosePrim(a, b, val)) {
        return false;
      }

      if (set === null) {
        set = new Set();
      }

      set.add(val);
    }
  }

  if (set !== null) {
    var bValues = arrayFromSet(b);

    for (var _i = 0; _i < bValues.length; _i++) {
      var _val = bValues[_i]; // We have to check if a primitive value is already
      // matching and only if it's not, go hunting for it.

      if (_typeof(_val) === 'object' && _val !== null) {
        if (!setHasEqualElement(set, _val, strict, memo)) return false;
      } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
  // To be able to handle cases like:
  //   Map([[{}, 'a'], [{}, 'b']]) vs Map([[{}, 'b'], [{}, 'a']])
  // ... we need to consider *all* matching keys, not just the first we find.
  var setValues = arrayFromSet(set);

  for (var i = 0; i < setValues.length; i++) {
    var key2 = setValues[i];

    if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
      set.delete(key2);
      return true;
    }
  }

  return false;
}

function mapEquiv(a, b, strict, memo) {
  var set = null;
  var aEntries = arrayFromMap(a);

  for (var i = 0; i < aEntries.length; i++) {
    var _aEntries$i = _slicedToArray(aEntries[i], 2),
        key = _aEntries$i[0],
        item1 = _aEntries$i[1];

    if (_typeof(key) === 'object' && key !== null) {
      if (set === null) {
        set = new Set();
      }

      set.add(key);
    } else {
      // By directly retrieving the value we prevent another b.has(key) check in
      // almost all possible cases.
      var item2 = b.get(key);

      if (item2 === undefined && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
        if (strict) return false; // Fast path to detect missing string, symbol, undefined and null
        // keys.

        if (!mapMightHaveLoosePrim(a, b, key, item1, memo)) return false;

        if (set === null) {
          set = new Set();
        }

        set.add(key);
      }
    }
  }

  if (set !== null) {
    var bEntries = arrayFromMap(b);

    for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
      var _bEntries$_i = _slicedToArray(bEntries[_i2], 2),
          key = _bEntries$_i[0],
          item = _bEntries$_i[1];

      if (_typeof(key) === 'object' && key !== null) {
        if (!mapHasEqualEntry(set, a, key, item, strict, memo)) return false;
      } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, false, memo)) && !mapHasEqualEntry(set, a, key, item, false, memo)) {
        return false;
      }
    }

    return set.size === 0;
  }

  return true;
}

function objEquiv(a, b, strict, keys, memos, iterationType) {
  // Sets and maps don't have their entries accessible via normal object
  // properties.
  var i = 0;

  if (iterationType === kIsSet) {
    if (!setEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsMap) {
    if (!mapEquiv(a, b, strict, memos)) {
      return false;
    }
  } else if (iterationType === kIsArray) {
    for (; i < a.length; i++) {
      if (hasOwnProperty(a, i)) {
        if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
          return false;
        }
      } else if (hasOwnProperty(b, i)) {
        return false;
      } else {
        // Array is sparse.
        var keysA = Object.keys(a);

        for (; i < keysA.length; i++) {
          var key = keysA[i];

          if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
            return false;
          }
        }

        if (keysA.length !== Object.keys(b).length) {
          return false;
        }

        return true;
      }
    }
  } // The pair must have equivalent values for every corresponding key.
  // Possibly expensive deep test:


  for (i = 0; i < keys.length; i++) {
    var _key = keys[i];

    if (!innerDeepEqual(a[_key], b[_key], strict, memos)) {
      return false;
    }
  }

  return true;
}

function isDeepEqual(val1, val2) {
  return innerDeepEqual(val1, val2, kLoose);
}

function isDeepStrictEqual(val1, val2) {
  return innerDeepEqual(val1, val2, kStrict);
}

module.exports = {
  isDeepEqual: isDeepEqual,
  isDeepStrictEqual: isDeepStrictEqual
};

/***/ }),

/***/ "./src/background/connections/dAppConnection/models.ts":
/*!*************************************************************!*\
  !*** ./src/background/connections/dAppConnection/models.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DAppProviderRequest": () => (/* binding */ DAppProviderRequest),
/* harmony export */   "Web3Event": () => (/* binding */ Web3Event)
/* harmony export */ });
let DAppProviderRequest = /*#__PURE__*/function (DAppProviderRequest) {
  DAppProviderRequest["DOMAIN_METADATA_METHOD"] = "avalanche_sendDomainMetadata";
  DAppProviderRequest["CONNECT_METHOD"] = "eth_requestAccounts";
  DAppProviderRequest["INIT_DAPP_STATE"] = "avalanche_getProviderState";
  DAppProviderRequest["ETH_ACCOUNTS"] = "eth_accounts";
  DAppProviderRequest["WALLET_PERMISSIONS"] = "wallet_requestPermissions";
  DAppProviderRequest["WALLET_GET_PERMISSIONS"] = "wallet_getPermissions";
  DAppProviderRequest["WALLET_ADD_CHAIN"] = "wallet_addEthereumChain";
  DAppProviderRequest["WALLET_GET_CHAIN"] = "wallet_getEthereumChain";
  DAppProviderRequest["WALLET_SWITCH_ETHEREUM_CHAIN"] = "wallet_switchEthereumChain";
  DAppProviderRequest["WALLET_WATCH_ASSET"] = "wallet_watchAsset";
  DAppProviderRequest["PERSONAL_EC_RECOVER"] = "personal_ecRecover";
  DAppProviderRequest["PERSONAL_SIGN"] = "personal_sign";
  DAppProviderRequest["ETH_SIGN_TYPED_DATA_V4"] = "eth_signTypedData_v4";
  DAppProviderRequest["ETH_SIGN_TYPED_DATA_V3"] = "eth_signTypedData_v3";
  DAppProviderRequest["ETH_SIGN_TYPED_DATA_V1"] = "eth_signTypedData_v1";
  DAppProviderRequest["ETH_SIGN_TYPED_DATA"] = "eth_signTypedData";
  DAppProviderRequest["ETH_SIGN"] = "eth_sign";
  DAppProviderRequest["AVALANCHE_GET_CONTACTS"] = "avalanche_getContacts";
  DAppProviderRequest["AVALANCHE_CREATE_CONTACT"] = "avalanche_createContact";
  DAppProviderRequest["AVALANCHE_UPDATE_CONTACT"] = "avalanche_updateContact";
  DAppProviderRequest["AVALANCHE_REMOVE_CONTACT"] = "avalanche_removeContact";
  DAppProviderRequest["AVALANCHE_GET_ACCOUNTS"] = "avalanche_getAccounts";
  DAppProviderRequest["AVALANCHE_GET_ADDRESSES_IN_RANGE"] = "avalanche_getAddressesInRange";
  DAppProviderRequest["AVALANCHE_BRIDGE_ASSET"] = "avalanche_bridgeAsset";
  DAppProviderRequest["AVALANCHE_GET_BRIDGE_STATE"] = "avalanche_getBridgeState";
  DAppProviderRequest["AVALANCHE_SELECT_WALLET"] = "avalanche_selectWallet";
  DAppProviderRequest["AVALANCHE_SET_DEVELOPER_MODE"] = "avalanche_setDeveloperMode";
  DAppProviderRequest["ACCOUNT_SELECT"] = "avalanche_selectAccount";
  DAppProviderRequest["ACCOUNT_RENAME"] = "avalanche_renameAccount";
  DAppProviderRequest["ACCOUNTS_DELETE"] = "avalanche_deleteAccounts";
  DAppProviderRequest["AVALANCHE_GET_ACCOUNT_PUB_KEY"] = "avalanche_getAccountPubKey";
  DAppProviderRequest["AVALANCHE_SEND_TRANSACTION"] = "avalanche_sendTransaction";
  DAppProviderRequest["AVALANCHE_SIGN_TRANSACTION"] = "avalanche_signTransaction";
  DAppProviderRequest["AVALANCHE_SIGN_MESSAGE"] = "avalanche_signMessage";
  DAppProviderRequest["BITCOIN_SEND_TRANSACTION"] = "bitcoin_sendTransaction";
  DAppProviderRequest["WALLET_RENAME"] = "avalanche_renameWallet";
  DAppProviderRequest["WALLET_ADD_NETWORK"] = "wallet_addNetwork";
  DAppProviderRequest["WALLET_GET_PUBKEY"] = "wallet_getPublicKey";
  DAppProviderRequest["WALLET_CONNECT"] = "wallet_requestAccountPermission";
  return DAppProviderRequest;
}({});
let Web3Event = /*#__PURE__*/function (Web3Event) {
  Web3Event["CONNECT"] = "connect";
  Web3Event["DISCONNECT"] = "disconnect";
  Web3Event["ACCOUNTS_CHANGED"] = "accountsChanged";
  Web3Event["ACCOUNTS_CHANGED_CA"] = "accountsChangedCA";
  Web3Event["CHAIN_CHANGED"] = "chainChanged";
  return Web3Event;
}({});

/***/ }),

/***/ "./src/background/connections/middlewares/models.ts":
/*!**********************************************************!*\
  !*** ./src/background/connections/middlewares/models.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFERRED_RESPONSE": () => (/* binding */ DEFERRED_RESPONSE)
/* harmony export */ });
const DEFERRED_RESPONSE = Symbol();

/***/ }),

/***/ "./src/background/providers/ChainAgnosticProvider.ts":
/*!***********************************************************!*\
  !*** ./src/background/providers/ChainAgnosticProvider.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChainAgnosticProvider": () => (/* binding */ ChainAgnosticProvider)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var _utils_RequestRatelimiter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/RequestRatelimiter */ "./src/background/providers/utils/RequestRatelimiter.ts");
/* harmony import */ var _utils_ProviderReadyPromise__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/ProviderReadyPromise */ "./src/background/providers/utils/ProviderReadyPromise.ts");
/* harmony import */ var _utils_onDomReady__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/onDomReady */ "./src/background/providers/utils/onDomReady.ts");
/* harmony import */ var _utils_getSiteMetadata__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/getSiteMetadata */ "./src/background/providers/utils/getSiteMetadata.ts");
/* harmony import */ var _utils_caipConversion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/caipConversion */ "./src/utils/caipConversion.ts");








class ChainAgnosticProvider extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
  #contentScriptConnection;
  #providerReadyPromise = new _utils_ProviderReadyPromise__WEBPACK_IMPORTED_MODULE_4__.ProviderReadyPromise([_utils_ProviderReadyPromise__WEBPACK_IMPORTED_MODULE_4__.InitializationStep.DOMAIN_METADATA_SENT]);
  #requestRateLimiter = new _utils_RequestRatelimiter__WEBPACK_IMPORTED_MODULE_3__["default"](['eth_requestAccounts', 'avalanche_selectWallet']);
  constructor(connection) {
    super();
    connection.connect();
    this.#contentScriptConnection = connection;
    this.#init();
  }
  async #init() {
    await this.#contentScriptConnection.connect();
    (0,_utils_onDomReady__WEBPACK_IMPORTED_MODULE_5__["default"])(async () => {
      const domainMetadata = await (0,_utils_getSiteMetadata__WEBPACK_IMPORTED_MODULE_6__.getSiteMetadata)();
      this.#request({
        data: {
          method: _connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_1__.DAppProviderRequest.DOMAIN_METADATA_METHOD,
          params: domainMetadata
        }
      });
      this.#providerReadyPromise.check(_utils_ProviderReadyPromise__WEBPACK_IMPORTED_MODULE_4__.InitializationStep.DOMAIN_METADATA_SENT);
    });
  }

  // If the namespace is EIP155 and the reference is a known fake chain ID (e.g. Bitcoin or Avalanche X/P chains),
  // we convert it to the corresponding CAIP-2 chain ID. Otherwise, we return the original scope.
  #normalizeScope = scope => {
    // If it's not an eip155: scope, don't touch it.
    if (typeof scope === 'string' && scope.startsWith('eip155:')) {
      const [_, chainId] = scope.split(':');
      return (0,_utils_caipConversion__WEBPACK_IMPORTED_MODULE_7__.chainIdToCaip)(Number(chainId));
    }
    return scope;
  };
  #request = async ({
    data,
    sessionId,
    scope
  }) => {
    if (!data) {
      throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_2__.ethErrors.rpc.invalidRequest();
    }
    const result = this.#contentScriptConnection.request({
      method: 'provider_request',
      jsonrpc: '2.0',
      params: {
        scope: this.#normalizeScope(scope),
        sessionId,
        request: {
          params: [],
          ...data
        }
      }
    }).catch(err => {
      // If the error is already a JsonRPCErorr do not serialize them.
      // eth-rpc-errors always wraps errors if they have an unkown error code
      // even if the code is valid like 4902 for unrecognized chain ID.
      if (!!err.code && Number.isInteger(err.code) && !!err.message) {
        throw err;
      }
      throw (0,eth_rpc_errors__WEBPACK_IMPORTED_MODULE_2__.serializeError)(err);
    });
    return result;
  };
  request = async ({
    data,
    sessionId,
    scope
  }) => {
    return this.#providerReadyPromise.call(() => {
      return this.#requestRateLimiter.call(data.method, () => this.#request({
        data,
        scope,
        sessionId
      }));
    });
  };
  subscribeToMessage = callback => {
    this.#contentScriptConnection.on('message', callback);
  };
}

/***/ }),

/***/ "./src/background/providers/MultiWalletProviderProxy.ts":
/*!**************************************************************!*\
  !*** ./src/background/providers/MultiWalletProviderProxy.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MultiWalletProviderProxy": () => (/* binding */ MultiWalletProviderProxy),
/* harmony export */   "createMultiWalletProxy": () => (/* binding */ createMultiWalletProxy)
/* harmony export */ });
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var _connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../connections/dAppConnection/models */ "./src/background/connections/dAppConnection/models.ts");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);



class MultiWalletProviderProxy extends (events__WEBPACK_IMPORTED_MODULE_2___default()) {
  #_providers = [];
  #isWalletSelected = false;
  #defaultProvider;
  get defaultProvider() {
    return this.#defaultProvider;
  }
  get providers() {
    // When the user decides to select the providers and there is more than one provider and EVMProvider is selected, we want to trigger the wallet selection. So we replace EVMProvider with this.
    if (this.#_providers.length > 1) {
      return [...this.#_providers].map(provider => {
        if (provider?.isAvalanche) {
          return new Proxy(this, {
            get(target, prop) {
              // eslint-disable-next-line no-prototype-builtins
              if (target.hasOwnProperty(prop)) {
                return target[prop];
                // eslint-disable-next-line no-prototype-builtins
              } else if (provider.hasOwnProperty(prop)) {
                return provider[prop];
              }
            }
          });
        }
        return provider;
      });
    }
    return [...this.#_providers];
  }
  constructor(coreProvider) {
    super();
    this.coreProvider = coreProvider;
    this.addProvider = this.addProvider.bind(this);
    this.enable = this.enable.bind(this);
    this.send = this.send.bind(this);
    this.request = this.request.bind(this);
    this._request = this._request.bind(this);
    this.#defaultProvider = coreProvider;
    this.#_providers.push(coreProvider);

    // Listen for new event subscriptions on the multi wallet provider.
    // We subscribe to those events on the currently used provider so
    // that the they can be re-emitted by the proxy.
    this.addListener('newListener', event => {
      this.#defaultProvider.addListener(event, (...args) => {
        this.emit(event, ...args);
      });
    });
  }
  addProvider(providerDetail) {
    const isProviderAdded = this.#_providers.find(provider => {
      return provider.info.uuid === providerDetail.info.uuid;
    });
    if (!isProviderAdded) {
      this.#_providers.push(providerDetail);
    }
  }
  async #toggleWalletSelection() {
    // no need to select a wallet when there is only one
    if (this.#_providers.length === 1 || this.#isWalletSelected) {
      return;
    }

    // get users wallet selection
    const selectedIndex = await this.coreProvider.request({
      method: 'avalanche_selectWallet',
      params: [
      // using any since we don't really know what kind of provider they are
      this.#_providers.map((p, i) => {
        return {
          index: i,
          info: p.info
        };
      })]
    });
    if (selectedIndex === undefined || selectedIndex === null || typeof selectedIndex !== 'number') {
      return;
    }
    if (selectedIndex !== 0) {
      // Migrate event subscription to the new event provider
      this.#defaultProvider.removeAllListeners();
      this.eventNames().forEach(event => {
        if (event === 'newListener') {
          return;
        }
        this.#_providers[selectedIndex]?.addListener(event, (...args) => {
          this.emit(event, ...args);
        });
      });
    }

    // store selection if successful to prevent showing selection popup multiple times
    // some dApps call eth_requestAccounts multiple times
    if (this.#_providers[selectedIndex]) {
      this.#isWalletSelected = true;
    }

    // set default wallet for this connection
    this.#defaultProvider = this.#_providers[selectedIndex] || this.#defaultProvider;
  }
  async _request(args) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.invalidRequest({
        message: eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.invalidRequest().message,
        data: args
      });
    }
    const {
      method
    } = args;

    // trigger wallet selection flow at connect in case multiple providers are available
    if ((method === _connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_1__.DAppProviderRequest.CONNECT_METHOD || method === _connections_dAppConnection_models__WEBPACK_IMPORTED_MODULE_1__.DAppProviderRequest.WALLET_CONNECT) && this.#_providers.length > 1) {
      await this.#toggleWalletSelection();
    }

    // default provider is selected, let call through
    return this.defaultProvider.request(args);
  }
  async enable() {
    await this.#toggleWalletSelection();
    return this.#defaultProvider.enable();
  }

  // implement request to intercept `eth_requestAccounts`
  // so that users can select which provider they want to use
  async request(args) {
    return this._request(args);
  }

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param callback - The callback function.
   */
  sendAsync(payload, callback) {
    this._request(payload).then(result => {
      callback(null, {
        ...payload,
        result
      });
    }).catch(e => {
      callback(e);
    });
  }

  /**
   * Submits an RPC request for the given method, with the given params.
   *
   * @deprecated Use "request" instead.
   * @param method - The method to request.
   * @param params - Any params for the method.
   * @returns A Promise that resolves with the JSON-RPC response object for the
   * request.
   */

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @deprecated Use "request" instead.
   * @param payload - A JSON-RPC request object.
   * @param callback - An error-first callback that will receive the JSON-RPC
   * response object.
   */

  /**
   * Accepts a JSON-RPC request object, and synchronously returns the cached result
   * for the given method. Only supports 4 specific RPC methods.
   *
   * @deprecated Use "request" instead.
   * @param payload - A JSON-RPC request object.
   * @returns A JSON-RPC response object.
   */

  // this is needed because there are multiple dApps which love to use an old deprecated method
  send(methodOrPayload, callbackOrArgs) {
    if (typeof methodOrPayload === 'string' && (!callbackOrArgs || Array.isArray(callbackOrArgs))) {
      return this._request({
        method: methodOrPayload,
        params: callbackOrArgs
      });
    }
    return this.sendAsync(methodOrPayload, callbackOrArgs);
  }
}
function createMultiWalletProxy(evmProvider) {
  const proxyProvider = new MultiWalletProviderProxy(evmProvider);
  // Some dApps like Pangolin likes to define helper methods on the window.ethereum object.
  // Store them separately to prevent them from altering the inpage provider behaviour
  const walletProviderExtensions = {};
  return new Proxy(proxyProvider, {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true,
    // intercept unknow calls that are meant to be handled by the current provider
    // and forward them if needed so that we don't have to implement all the custom
    // functions any given wallet provider might expose
    get: (_, prop, receiver) => {
      // if the proxy has the function call it
      if (proxyProvider[prop]) {
        return proxyProvider[prop];
      }
      if (proxyProvider.defaultProvider[prop]) {
        // otherwise forward to the default provider
        return Reflect.get(proxyProvider.defaultProvider, prop, receiver);
      }

      // check if the request param is an extension defined by the dApp
      return Reflect.get(walletProviderExtensions, prop, receiver);
    },
    set(_, prop, value) {
      Reflect.set(walletProviderExtensions, prop, value);
      return true;
    }
  });
}

/***/ }),

/***/ "./src/background/providers/initializeInpageProvider.ts":
/*!**************************************************************!*\
  !*** ./src/background/providers/initializeInpageProvider.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initializeProvider": () => (/* binding */ initializeProvider)
/* harmony export */ });
/* harmony import */ var _avalabs_evm_module_dist_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/evm-module/dist/provider */ "./node_modules/@avalabs/evm-module/dist/provider/index.js");
/* harmony import */ var _avalabs_svm_module_dist_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/svm-module/dist/provider */ "./node_modules/@avalabs/svm-module/dist/provider/index.js");
/* harmony import */ var _ChainAgnosticProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChainAgnosticProvider */ "./src/background/providers/ChainAgnosticProvider.ts");
/* harmony import */ var _MultiWalletProviderProxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MultiWalletProviderProxy */ "./src/background/providers/MultiWalletProviderProxy.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ "./src/background/providers/models.ts");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");






/**
 * Initializes a CoreProvide and assigns it as window.ethereum.
 *
 * @param connection - Communication channel name to communicate with the contentscript on
 * @param maxListeners - The maximum number of event listeners.
 * @param globalObject - Defaults to window. Defines what to set the provider on.
 * @returns The initialized provider (whether set or not).
 */
function initializeProvider(connection, maxListeners = 100, globalObject = window) {
  const chainAgnosticProvider = new Proxy(new _ChainAgnosticProvider__WEBPACK_IMPORTED_MODULE_2__.ChainAgnosticProvider(connection), {
    deleteProperty: () => true
  });
  const evmProvider = new Proxy(new _avalabs_evm_module_dist_provider__WEBPACK_IMPORTED_MODULE_0__.EVMProvider({
    maxListeners,
    // Core Web needs to know which extension version it's working with
    // For local (dev) builds, CORE_EXTENSION_VERSION is 0.0.0
    // For release builds (alpha or production), it's replaced by semantic-release to the actual version number
    walletVersion: "0.0.0",
    info: {
      name: "Core Dev",
      uuid: "b11db586-a24d-4d95-81c1-62bb8e9da7b5",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF8yNzA0XzI0MTEyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNEOUQ5RDkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzI3MDRfMjQxMTIpIj4KPHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMyODI4MkUiLz4KPC9nPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMjcwNF8yNDExMikiPgo8cGF0aCBkPSJNNTMuMDY3NyA0OS4wMTA0QzU1Ljc5NjcgNDkuMDEwNCA1OC4yNjk5IDQ5LjYxNTkgNjAuNDg3MiA1MC44MjY5QzYyLjcwNDUgNTIuMDM3OSA2NC40NTI4IDUzLjc1MiA2NS43MzIgNTUuOTY5M0M2Ny4wMTEyIDU4LjE4NjYgNjcuNjUwOCA2MC43NDUxIDY3LjY1MDggNjMuNjQ0NkM2Ny42NTA4IDY2LjU0NDIgNjYuOTk0MSA2OS4xMDI2IDY1LjY4MDggNzEuMzE5OUM2NC4zNjc1IDczLjUzNzMgNjIuNTkzNiA3NS4yNTE0IDYwLjM1OTMgNzYuNDYyNEM1OC4xMjQ5IDc3LjY3MzQgNTUuNjI2MSA3OC4yNzg5IDUyLjg2MyA3OC4yNzg5QzUwLjEzNCA3OC4yNzg5IDQ3LjY3NzkgNzcuNjczNCA0NS40OTQ3IDc2LjQ2MjRDNDMuMzExNSA3NS4yNTE0IDQxLjU5NzQgNzMuNTM3MyA0MC4zNTIzIDcxLjMxOTlDMzkuMTA3MiA2OS4xMDI2IDM4LjQ4NDYgNjYuNTQ0MiAzOC40ODQ2IDYzLjY0NDZDMzguNDg0NiA2MC43NDUxIDM5LjEyNDMgNTguMTg2NiA0MC40MDM1IDU1Ljk2OTNDNDEuNjgyNyA1My43NTIgNDMuNDMwOSA1Mi4wMzc5IDQ1LjY0ODIgNTAuODI2OUM0Ny44NjU2IDQ5LjYxNTkgNTAuMzM4NyA0OS4wMTA0IDUzLjA2NzcgNDkuMDEwNFpNNTMuMDY3NyA1NS45NjkzQzUxLjYzMTQgNTUuOTY5MyA1MC4zMjk3IDU2LjI4NjkgNDkuMTYyNyA1Ni45MjJDNDcuOTk1NyA1Ny41NTcyIDQ3LjA3NTYgNTguNDU2MiA0Ni40MDIzIDU5LjYxOTFDNDUuNzI5MSA2MC43ODIgNDUuMzkyNCA2Mi4xMjM5IDQ1LjM5MjQgNjMuNjQ0NkM0NS4zOTI0IDY1LjE2NTQgNDUuNzIwMSA2Ni41MDcyIDQ2LjM3NTQgNjcuNjcwMUM0Ny4wMzA3IDY4LjgzMzEgNDcuOTMyOSA2OS43MzIxIDQ5LjA4MiA3MC4zNjcyQzUwLjIzMSA3MS4wMDI0IDUxLjUyMzcgNzEuMzE5OSA1Mi45NiA3MS4zMTk5QzU0LjQxNDMgNzEuMzE5OSA1NS43Mjk0IDcxLjAwMjQgNTYuOTA1MyA3MC4zNjcyQzU4LjA4MTMgNjkuNzMyMSA1OS4wMTUgNjguODMzMSA1OS43MDYyIDY3LjY3MDFDNjAuMzk3NCA2Ni41MDcyIDYwLjc0MyA2NS4xNjU0IDYwLjc0MyA2My42NDQ2QzYwLjc0MyA2Mi4xMjM5IDYwLjQwNjQgNjAuNzgyIDU5LjczMzEgNTkuNjE5MUM1OS4wNTk5IDU4LjQ1NjIgNTguMTM5NyA1Ny41NTcyIDU2Ljk3MjcgNTYuOTIyQzU1LjgwNTcgNTYuMjg2OSA1NC41MDQgNTUuOTY5MyA1My4wNjc3IDU1Ljk2OTNaTTI2LjkyMDUgNDkuMDEwNEMyOS42NDk1IDQ5LjAxMDQgMzIuMTIyNyA0OS42MTU5IDM0LjM0IDUwLjgyNjlDMzYuNTU3MyA1Mi4wMzc5IDM4LjMwNTUgNTMuNzUyIDM5LjU4NDcgNTUuOTY5M0M0MC4zMDc4IDU3LjIyMjYgNDAuODI2NSA1OC41ODQ5IDQxLjE0MDggNjAuMDU2MUwzMy42ODY5IDYwLjA1NjNDMzMuMTg5OCA1OC41OTQyIDMyLjEyMDQgNTcuNTU3MiAzMC45NTM0IDU2LjkyMkMyOS43ODY0IDU2LjI4NjkgMjguNDg0OCA1NS45NjkzIDI3LjA0ODQgNTUuOTY5M0MyNS42MTIxIDU1Ljk2OTMgMjQuMzEwNSA1Ni4yODY5IDIzLjE0MzUgNTYuOTIyQzIxLjk3NjQgNTcuNTU3MiAyMS4wNTYzIDU4LjQ1NjIgMjAuMzgzIDU5LjYxOTFDMTkuNzA5NyA2MC43ODIgMTkuMzczMSA2Mi4xMjM5IDE5LjM3MzEgNjMuNjQ0NkMxOS4zNzMxIDY1LjE2NTQgMTkuNzAwOCA2Ni41MDcyIDIwLjM1NjEgNjcuNjcwMUMyMS4wMTE0IDY4LjgzMzEgMjEuOTEzNiA2OS43MzIxIDIzLjA2MjYgNzAuMzY3MkMyNC4yMTE3IDcxLjAwMjQgMjUuNTA0NCA3MS4zMTk5IDI2Ljk0MDcgNzEuMzE5OUMyOC4zOTUgNzEuMzE5OSAyOS43MTAxIDcxLjAwMjQgMzAuODg2MSA3MC4zNjcyQzMyLjA2MjEgNjkuNzMyMSAzMi45OTU2IDY4LjgzMzEgMzMuNjg2OSA2Ny42NzAxTDQxLjAyODQgNjcuNjcwMkM0MC43MDAxIDY4Ljk3NTEgNDAuMjAxOSA3MC4xOTE3IDM5LjUzMzYgNzEuMzE5OUMzOC4yMjAzIDczLjUzNzMgMzYuNDQ2NCA3NS4yNTE0IDM0LjIxMiA3Ni40NjI0QzMxLjk3NzcgNzcuNjczNCAyOS40Nzg5IDc4LjI3ODkgMjYuNzE1OCA3OC4yNzg5QzIzLjk4NjggNzguMjc4OSAyMS41MzA3IDc3LjY3MzQgMTkuMzQ3NSA3Ni40NjI0QzE3LjE2NDMgNzUuMjUxNCAxNS40NTAxIDczLjUzNzMgMTQuMjA1IDcxLjMxOTlDMTIuOTU5OSA2OS4xMDI2IDEyLjMzNzQgNjYuNTQ0MiAxMi4zMzc0IDYzLjY0NDZDMTIuMzM3NCA2MC43NDUxIDEyLjk3NyA1OC4xODY2IDE0LjI1NjIgNTUuOTY5M0MxNS41MzU0IDUzLjc1MiAxNy4yODM3IDUyLjAzNzkgMTkuNTAxIDUwLjgyNjlDMjEuNzE4NCA0OS42MTU5IDI0LjE5MTUgNDkuMDEwNCAyNi45MjA1IDQ5LjAxMDRaTTEwMi40NjUgNDkuMDEwNEMxMDUuMTYgNDkuMDEwNCAxMDcuNTczIDQ5LjU5MDMgMTA5LjcwNSA1MC43NTAxQzExMS44MzcgNTEuOTA5OSAxMTMuNDkyIDUzLjU1NTkgMTE0LjY2OCA1NS42ODc5QzExNS44NDUgNTcuODE5OSAxMTYuNDM0IDYwLjI2NzUgMTE2LjQzNCA2My4wMzA2QzExNi40MzQgNjQuMDU0IDExNi4zNjYgNjQuOTc1IDExNi4yMjkgNjUuNzkzN0g5NS41MDU4TDk1LjUzNTUgNjYuMDk3NEM5NS43NDk0IDY3Ljk5OTcgOTYuNDU1OCA2OS41MDE3IDk3LjY1NDkgNzAuNjAzNkM5OC45MTcgNzEuNzYzNCAxMDAuNDY5IDcyLjM0MzMgMTAyLjMxMSA3Mi4zNDMzQzEwNC45NzIgNzIuMzQzMyAxMDYuODY1IDcxLjIwMDUgMTA3Ljk5MSA2OC45MTVIMTE1LjcxN0wxMTUuNjExIDY5LjI1MzZDMTE0Ljc2NyA3MS44MzAxIDExMy4yMzMgNzMuOTYwMSAxMTEuMDEgNzUuNjQzN0MxMDguNjkgNzcuNDAwNSAxMDUuODQyIDc4LjI3ODkgMTAyLjQ2NSA3OC4yNzg5Qzk5LjczNTcgNzguMjc4OSA5Ny4yODgyIDc3LjY3MzQgOTUuMTIyIDc2LjQ2MjRDOTIuOTU1OSA3NS4yNTE0IDkxLjI2NzMgNzMuNTM3MyA5MC4wNTYzIDcxLjMxOTlDODguODQ1MyA2OS4xMDI2IDg4LjIzOTggNjYuNTQ0MiA4OC4yMzk4IDYzLjY0NDZDODguMjM5OCA2MS4xNDA0IDg4LjY3NDggNTguODk3MiA4OS41NDQ3IDU2LjkxNUw4Ny4yOTczIDU2LjkxNTFMODYuOTgzMSA1Ni45MTk0Qzg1LjUzNTcgNTYuOTU5NCA4NC4zNDcyIDU3LjI3OTYgODMuNDE3NiA1Ny44Nzk5QzgyLjQyMTcgNTguNTIzMiA4MS43MDAyIDU5LjQwMTggODEuMjUzMSA2MC41MTZDODAuODA1OSA2MS42MzAxIDgwLjU4MjMgNjIuOTAyOSA4MC41ODIzIDY0LjMzNDJWNzEuNjA3M0g4OC4zNDMzVjc4LjE1NzRINjcuMDk2N1Y3MS42MDczSDcyLjgyNzRWNTYuNDYxNkg2Ny4wOTY3VjQ5LjkxMjVIODAuMDA2MUw4MC4yNDIyIDU0LjgxN0w4MC40Mzg3IDU0LjQ2NjlDODAuOTA4NiA1My42NjE4IDgxLjQ1OSA1Mi45Mzg2IDgyLjA5IDUyLjI5NzNDODIuODExMSA1MS41NjQ1IDgzLjcwNDggNTAuOTgzOCA4NC43NzExIDUwLjU1NTNDODUuODM3NCA1MC4xMjY3IDg3LjEzMSA0OS45MTI1IDg4LjY1MTYgNDkuOTEyNUg5MS45MjQ0TDkxLjkyNDMgNTMuMjQ0N0M5Mi44MTkzIDUyLjI3NDUgOTMuODU5NiA1MS40NiA5NS4wNDUyIDUwLjgwMTNDOTcuMTk0MyA0OS42MDczIDk5LjY2NzUgNDkuMDEwNCAxMDIuNDY1IDQ5LjAxMDRaTTEwMi4yNiA1NC44OTQ4QzEwMC40ODYgNTQuODk0OCA5OC45OTM4IDU1LjQzMjEgOTcuNzgyOCA1Ni41MDY2Qzk2LjU3MTggNTcuNTgxMSA5NS44Mjk4IDU5LjA3MzYgOTUuNTU2OSA2MC45ODM5SDEwOS4wMTRDMTA4Ljk4IDU5LjE0MTggMTA4LjMxNSA1Ny42NjY0IDEwNy4wMTkgNTYuNTU3OEMxMDUuNzIyIDU1LjQ0OTEgMTA0LjEzNiA1NC44OTQ4IDEwMi4yNiA1NC44OTQ4WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yNzA0XzI0MTEyIj4KPHJlY3Qgd2lkdGg9IjEwNC4wOTYiIGhlaWdodD0iMjkuOTc5OCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjMzNzQgNDkuMDEwNSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
      description: "Core Dev Browser Extension",
      rdns: "app.core.extension"
    }
  }), {
    // some common libraries, e.g. web3@1.x, mess with our API
    deleteProperty: () => true
  });
  const multiWalletProxy = (0,_MultiWalletProviderProxy__WEBPACK_IMPORTED_MODULE_3__.createMultiWalletProxy)(evmProvider);
  globalObject.addEventListener('eip6963:announceProvider', event => {
    multiWalletProxy.addProvider(new Proxy({
      info: {
        ...event.detail.info
      },
      ...event.detail.provider
    }, {
      deleteProperty: () => true,
      set: () => true
    }));
  });
  setGlobalProvider(evmProvider, globalObject, multiWalletProxy);
  setAvalancheGlobalProvider(evmProvider, globalObject);
  announceWalletProvider(evmProvider, globalObject);
  announceChainAgnosticProvider(chainAgnosticProvider, globalObject);

  // TODO: remove prior to actual release and also uncomment the test
  try {
    if (localStorage.getItem('__core__solana__enabled') === 'true') {
      (0,_avalabs_svm_module_dist_provider__WEBPACK_IMPORTED_MODULE_1__.initialize)(new _avalabs_svm_module_dist_provider__WEBPACK_IMPORTED_MODULE_1__.SolanaWalletProvider(chainAgnosticProvider, {
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF8yNzA0XzI0MTEyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNEOUQ5RDkiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzI3MDRfMjQxMTIpIj4KPHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiMyODI4MkUiLz4KPC9nPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMjcwNF8yNDExMikiPgo8cGF0aCBkPSJNNTMuMDY3NyA0OS4wMTA0QzU1Ljc5NjcgNDkuMDEwNCA1OC4yNjk5IDQ5LjYxNTkgNjAuNDg3MiA1MC44MjY5QzYyLjcwNDUgNTIuMDM3OSA2NC40NTI4IDUzLjc1MiA2NS43MzIgNTUuOTY5M0M2Ny4wMTEyIDU4LjE4NjYgNjcuNjUwOCA2MC43NDUxIDY3LjY1MDggNjMuNjQ0NkM2Ny42NTA4IDY2LjU0NDIgNjYuOTk0MSA2OS4xMDI2IDY1LjY4MDggNzEuMzE5OUM2NC4zNjc1IDczLjUzNzMgNjIuNTkzNiA3NS4yNTE0IDYwLjM1OTMgNzYuNDYyNEM1OC4xMjQ5IDc3LjY3MzQgNTUuNjI2MSA3OC4yNzg5IDUyLjg2MyA3OC4yNzg5QzUwLjEzNCA3OC4yNzg5IDQ3LjY3NzkgNzcuNjczNCA0NS40OTQ3IDc2LjQ2MjRDNDMuMzExNSA3NS4yNTE0IDQxLjU5NzQgNzMuNTM3MyA0MC4zNTIzIDcxLjMxOTlDMzkuMTA3MiA2OS4xMDI2IDM4LjQ4NDYgNjYuNTQ0MiAzOC40ODQ2IDYzLjY0NDZDMzguNDg0NiA2MC43NDUxIDM5LjEyNDMgNTguMTg2NiA0MC40MDM1IDU1Ljk2OTNDNDEuNjgyNyA1My43NTIgNDMuNDMwOSA1Mi4wMzc5IDQ1LjY0ODIgNTAuODI2OUM0Ny44NjU2IDQ5LjYxNTkgNTAuMzM4NyA0OS4wMTA0IDUzLjA2NzcgNDkuMDEwNFpNNTMuMDY3NyA1NS45NjkzQzUxLjYzMTQgNTUuOTY5MyA1MC4zMjk3IDU2LjI4NjkgNDkuMTYyNyA1Ni45MjJDNDcuOTk1NyA1Ny41NTcyIDQ3LjA3NTYgNTguNDU2MiA0Ni40MDIzIDU5LjYxOTFDNDUuNzI5MSA2MC43ODIgNDUuMzkyNCA2Mi4xMjM5IDQ1LjM5MjQgNjMuNjQ0NkM0NS4zOTI0IDY1LjE2NTQgNDUuNzIwMSA2Ni41MDcyIDQ2LjM3NTQgNjcuNjcwMUM0Ny4wMzA3IDY4LjgzMzEgNDcuOTMyOSA2OS43MzIxIDQ5LjA4MiA3MC4zNjcyQzUwLjIzMSA3MS4wMDI0IDUxLjUyMzcgNzEuMzE5OSA1Mi45NiA3MS4zMTk5QzU0LjQxNDMgNzEuMzE5OSA1NS43Mjk0IDcxLjAwMjQgNTYuOTA1MyA3MC4zNjcyQzU4LjA4MTMgNjkuNzMyMSA1OS4wMTUgNjguODMzMSA1OS43MDYyIDY3LjY3MDFDNjAuMzk3NCA2Ni41MDcyIDYwLjc0MyA2NS4xNjU0IDYwLjc0MyA2My42NDQ2QzYwLjc0MyA2Mi4xMjM5IDYwLjQwNjQgNjAuNzgyIDU5LjczMzEgNTkuNjE5MUM1OS4wNTk5IDU4LjQ1NjIgNTguMTM5NyA1Ny41NTcyIDU2Ljk3MjcgNTYuOTIyQzU1LjgwNTcgNTYuMjg2OSA1NC41MDQgNTUuOTY5MyA1My4wNjc3IDU1Ljk2OTNaTTI2LjkyMDUgNDkuMDEwNEMyOS42NDk1IDQ5LjAxMDQgMzIuMTIyNyA0OS42MTU5IDM0LjM0IDUwLjgyNjlDMzYuNTU3MyA1Mi4wMzc5IDM4LjMwNTUgNTMuNzUyIDM5LjU4NDcgNTUuOTY5M0M0MC4zMDc4IDU3LjIyMjYgNDAuODI2NSA1OC41ODQ5IDQxLjE0MDggNjAuMDU2MUwzMy42ODY5IDYwLjA1NjNDMzMuMTg5OCA1OC41OTQyIDMyLjEyMDQgNTcuNTU3MiAzMC45NTM0IDU2LjkyMkMyOS43ODY0IDU2LjI4NjkgMjguNDg0OCA1NS45NjkzIDI3LjA0ODQgNTUuOTY5M0MyNS42MTIxIDU1Ljk2OTMgMjQuMzEwNSA1Ni4yODY5IDIzLjE0MzUgNTYuOTIyQzIxLjk3NjQgNTcuNTU3MiAyMS4wNTYzIDU4LjQ1NjIgMjAuMzgzIDU5LjYxOTFDMTkuNzA5NyA2MC43ODIgMTkuMzczMSA2Mi4xMjM5IDE5LjM3MzEgNjMuNjQ0NkMxOS4zNzMxIDY1LjE2NTQgMTkuNzAwOCA2Ni41MDcyIDIwLjM1NjEgNjcuNjcwMUMyMS4wMTE0IDY4LjgzMzEgMjEuOTEzNiA2OS43MzIxIDIzLjA2MjYgNzAuMzY3MkMyNC4yMTE3IDcxLjAwMjQgMjUuNTA0NCA3MS4zMTk5IDI2Ljk0MDcgNzEuMzE5OUMyOC4zOTUgNzEuMzE5OSAyOS43MTAxIDcxLjAwMjQgMzAuODg2MSA3MC4zNjcyQzMyLjA2MjEgNjkuNzMyMSAzMi45OTU2IDY4LjgzMzEgMzMuNjg2OSA2Ny42NzAxTDQxLjAyODQgNjcuNjcwMkM0MC43MDAxIDY4Ljk3NTEgNDAuMjAxOSA3MC4xOTE3IDM5LjUzMzYgNzEuMzE5OUMzOC4yMjAzIDczLjUzNzMgMzYuNDQ2NCA3NS4yNTE0IDM0LjIxMiA3Ni40NjI0QzMxLjk3NzcgNzcuNjczNCAyOS40Nzg5IDc4LjI3ODkgMjYuNzE1OCA3OC4yNzg5QzIzLjk4NjggNzguMjc4OSAyMS41MzA3IDc3LjY3MzQgMTkuMzQ3NSA3Ni40NjI0QzE3LjE2NDMgNzUuMjUxNCAxNS40NTAxIDczLjUzNzMgMTQuMjA1IDcxLjMxOTlDMTIuOTU5OSA2OS4xMDI2IDEyLjMzNzQgNjYuNTQ0MiAxMi4zMzc0IDYzLjY0NDZDMTIuMzM3NCA2MC43NDUxIDEyLjk3NyA1OC4xODY2IDE0LjI1NjIgNTUuOTY5M0MxNS41MzU0IDUzLjc1MiAxNy4yODM3IDUyLjAzNzkgMTkuNTAxIDUwLjgyNjlDMjEuNzE4NCA0OS42MTU5IDI0LjE5MTUgNDkuMDEwNCAyNi45MjA1IDQ5LjAxMDRaTTEwMi40NjUgNDkuMDEwNEMxMDUuMTYgNDkuMDEwNCAxMDcuNTczIDQ5LjU5MDMgMTA5LjcwNSA1MC43NTAxQzExMS44MzcgNTEuOTA5OSAxMTMuNDkyIDUzLjU1NTkgMTE0LjY2OCA1NS42ODc5QzExNS44NDUgNTcuODE5OSAxMTYuNDM0IDYwLjI2NzUgMTE2LjQzNCA2My4wMzA2QzExNi40MzQgNjQuMDU0IDExNi4zNjYgNjQuOTc1IDExNi4yMjkgNjUuNzkzN0g5NS41MDU4TDk1LjUzNTUgNjYuMDk3NEM5NS43NDk0IDY3Ljk5OTcgOTYuNDU1OCA2OS41MDE3IDk3LjY1NDkgNzAuNjAzNkM5OC45MTcgNzEuNzYzNCAxMDAuNDY5IDcyLjM0MzMgMTAyLjMxMSA3Mi4zNDMzQzEwNC45NzIgNzIuMzQzMyAxMDYuODY1IDcxLjIwMDUgMTA3Ljk5MSA2OC45MTVIMTE1LjcxN0wxMTUuNjExIDY5LjI1MzZDMTE0Ljc2NyA3MS44MzAxIDExMy4yMzMgNzMuOTYwMSAxMTEuMDEgNzUuNjQzN0MxMDguNjkgNzcuNDAwNSAxMDUuODQyIDc4LjI3ODkgMTAyLjQ2NSA3OC4yNzg5Qzk5LjczNTcgNzguMjc4OSA5Ny4yODgyIDc3LjY3MzQgOTUuMTIyIDc2LjQ2MjRDOTIuOTU1OSA3NS4yNTE0IDkxLjI2NzMgNzMuNTM3MyA5MC4wNTYzIDcxLjMxOTlDODguODQ1MyA2OS4xMDI2IDg4LjIzOTggNjYuNTQ0MiA4OC4yMzk4IDYzLjY0NDZDODguMjM5OCA2MS4xNDA0IDg4LjY3NDggNTguODk3MiA4OS41NDQ3IDU2LjkxNUw4Ny4yOTczIDU2LjkxNTFMODYuOTgzMSA1Ni45MTk0Qzg1LjUzNTcgNTYuOTU5NCA4NC4zNDcyIDU3LjI3OTYgODMuNDE3NiA1Ny44Nzk5QzgyLjQyMTcgNTguNTIzMiA4MS43MDAyIDU5LjQwMTggODEuMjUzMSA2MC41MTZDODAuODA1OSA2MS42MzAxIDgwLjU4MjMgNjIuOTAyOSA4MC41ODIzIDY0LjMzNDJWNzEuNjA3M0g4OC4zNDMzVjc4LjE1NzRINjcuMDk2N1Y3MS42MDczSDcyLjgyNzRWNTYuNDYxNkg2Ny4wOTY3VjQ5LjkxMjVIODAuMDA2MUw4MC4yNDIyIDU0LjgxN0w4MC40Mzg3IDU0LjQ2NjlDODAuOTA4NiA1My42NjE4IDgxLjQ1OSA1Mi45Mzg2IDgyLjA5IDUyLjI5NzNDODIuODExMSA1MS41NjQ1IDgzLjcwNDggNTAuOTgzOCA4NC43NzExIDUwLjU1NTNDODUuODM3NCA1MC4xMjY3IDg3LjEzMSA0OS45MTI1IDg4LjY1MTYgNDkuOTEyNUg5MS45MjQ0TDkxLjkyNDMgNTMuMjQ0N0M5Mi44MTkzIDUyLjI3NDUgOTMuODU5NiA1MS40NiA5NS4wNDUyIDUwLjgwMTNDOTcuMTk0MyA0OS42MDczIDk5LjY2NzUgNDkuMDEwNCAxMDIuNDY1IDQ5LjAxMDRaTTEwMi4yNiA1NC44OTQ4QzEwMC40ODYgNTQuODk0OCA5OC45OTM4IDU1LjQzMjEgOTcuNzgyOCA1Ni41MDY2Qzk2LjU3MTggNTcuNTgxMSA5NS44Mjk4IDU5LjA3MzYgOTUuNTU2OSA2MC45ODM5SDEwOS4wMTRDMTA4Ljk4IDU5LjE0MTggMTA4LjMxNSA1Ny42NjY0IDEwNy4wMTkgNTYuNTU3OEMxMDUuNzIyIDU1LjQ0OTEgMTA0LjEzNiA1NC44OTQ4IDEwMi4yNiA1NC44OTQ4WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yNzA0XzI0MTEyIj4KPHJlY3Qgd2lkdGg9IjEwNC4wOTYiIGhlaWdodD0iMjkuOTc5OCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjMzNzQgNDkuMDEwNSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
        name: "Core Dev",
        version: "0.0.0"
      }));
    }
  } catch {
    // Do nothing
  }
  return evmProvider;
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
function setGlobalProvider(providerInstance, globalObject = window, multiWalletProxy) {
  try {
    Object.defineProperty(globalObject, 'ethereum', {
      get: () => {
        return multiWalletProxy;
      },
      // in case a wallet tries to overwrite us lets add them to the list
      set: () => {
        return multiWalletProxy;
      }
    });
    let windowWeb3Obj = {
      currentProvider: multiWalletProxy
    };
    Object.defineProperty(globalObject, 'web3', {
      get: () => {
        return windowWeb3Obj;
      },
      // let dApps define window.web3.eth and similar extensions to the window.web3 object
      set: value => {
        if (value.__isMetaMaskShim__) return;
        windowWeb3Obj = {
          ...value,
          currentProvider: multiWalletProxy
        };
        return true;
      }
    });
    globalObject.dispatchEvent(new Event('ethereum#initialized'));
  } catch (e) {
    // some browser was faster and defined the window.ethereum as non writable before us
    console.error('Cannot set Core window.ethereum provider', e);

    // try to set the providerInstance in case it's a proxy like we are
    globalObject.ethereum = providerInstance;
  }
}

/**
 * Sets the given provider instance as window.ethereum and dispatches the
 * 'ethereum#initialized' event on window.
 *
 * @param providerInstance - The provider instance.
 */
function setAvalancheGlobalProvider(providerInstance, globalObject = window) {
  Object.defineProperty(globalObject, 'avalanche', {
    value: providerInstance,
    writable: false
  });
  globalObject.dispatchEvent(new Event('avalanche#initialized'));
}
function announceWalletProvider(providerInstance, globalObject = window) {
  const announceEvent = new CustomEvent(_models__WEBPACK_IMPORTED_MODULE_4__.EventNames.EIP6963_ANNOUNCE_PROVIDER, {
    detail: Object.freeze({
      info: {
        ...providerInstance.info
      },
      provider: providerInstance
    })
  });

  // The Wallet dispatches an announce event which is heard by
  // the DApp code that had run earlier
  globalObject.dispatchEvent(announceEvent);

  // The Wallet listens to the request events which may be
  // dispatched later and re-dispatches the `EIP6963AnnounceProviderEvent`
  globalObject.addEventListener(_models__WEBPACK_IMPORTED_MODULE_4__.EventNames.EIP6963_REQUEST_PROVIDER, () => {
    globalObject.dispatchEvent(announceEvent);
  });
}
function announceChainAgnosticProvider(providerInstance, globalObject = window) {
  const announceEvent = new CustomEvent(_models__WEBPACK_IMPORTED_MODULE_4__.EventNames.CORE_WALLET_ANNOUNCE_PROVIDER, {
    detail: Object.freeze({
      provider: providerInstance
    })
  });

  // The Wallet dispatches an announce event which is heard by
  // the DApp code that had run earlier
  globalObject.dispatchEvent(announceEvent);

  // The Wallet listens to the request events which may be
  // dispatched later and re-dispatches the `EIP6963AnnounceProviderEvent`
  globalObject.addEventListener(_models__WEBPACK_IMPORTED_MODULE_4__.EventNames.CORE_WALLET_REQUEST_PROVIDER, () => {
    globalObject.dispatchEvent(announceEvent);
  });
}

/***/ }),

/***/ "./src/background/providers/models.ts":
/*!********************************************!*\
  !*** ./src/background/providers/models.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventNames": () => (/* binding */ EventNames)
/* harmony export */ });
let EventNames = /*#__PURE__*/function (EventNames) {
  EventNames["CORE_WALLET_ANNOUNCE_PROVIDER"] = "core-wallet:announceProvider";
  EventNames["CORE_WALLET_REQUEST_PROVIDER"] = "core-wallet:requestProvider";
  EventNames["EIP6963_ANNOUNCE_PROVIDER"] = "eip6963:announceProvider";
  EventNames["EIP6963_REQUEST_PROVIDER"] = "eip6963:requestProvider";
  return EventNames;
}({});

/***/ }),

/***/ "./src/background/providers/utils/ProviderReadyPromise.ts":
/*!****************************************************************!*\
  !*** ./src/background/providers/utils/ProviderReadyPromise.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InitializationStep": () => (/* binding */ InitializationStep),
/* harmony export */   "ProviderReadyPromise": () => (/* binding */ ProviderReadyPromise)
/* harmony export */ });
let InitializationStep = /*#__PURE__*/function (InitializationStep) {
  InitializationStep["DOMAIN_METADATA_SENT"] = "domain_metadata_sent";
  InitializationStep["PROVIDER_STATE_LOADED"] = "provider_state_loaded";
  return InitializationStep;
}({});
class ProviderReadyPromise {
  #unpreparedSteps = new Map();
  #inflightRequests = [];
  constructor(steps) {
    steps.map(step => this.#unpreparedSteps.set(step, true));
  }
  check = step => {
    const hasStep = this.#unpreparedSteps.has(step);
    if (hasStep) {
      this.#unpreparedSteps.delete(step);
    }
    this._proceed();
  };
  uncheck = step => {
    this.#unpreparedSteps.set(step, true);
  };
  _proceed = () => {
    if (this.#unpreparedSteps.size) {
      return;
    }
    while (this.#inflightRequests.length) {
      const request = this.#inflightRequests.shift();
      request?.resolve(request?.fn());
    }
  };
  call = fn => {
    return new Promise(resolve => {
      this.#inflightRequests.push({
        fn,
        resolve
      });
      this._proceed();
    });
  };
}

/***/ }),

/***/ "./src/background/providers/utils/RequestRatelimiter.ts":
/*!**************************************************************!*\
  !*** ./src/background/providers/utils/RequestRatelimiter.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");

class RequestRatelimiter {
  #rateLimitedMethods;
  #requestsInflight = {};
  constructor(rateLimitedMethods) {
    this.#rateLimitedMethods = rateLimitedMethods;
  }
  async call(key, defer) {
    if (this.#rateLimitedMethods.includes(key) && this.#requestsInflight[key]) {
      throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_0__.ethErrors.rpc.resourceUnavailable(`Request of type ${key} already pending for origin. Please wait.`);
    }
    return new Promise(resolve => {
      this.#requestsInflight[key] = (this.#requestsInflight[key] || 0) + 1;
      resolve(defer().finally(() => {
        this.#requestsInflight[key] = (this.#requestsInflight[key] || 0) - 1;
        if (!this.#requestsInflight[key]) {
          delete this.#requestsInflight[key];
        }
      }));
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RequestRatelimiter);

/***/ }),

/***/ "./src/background/providers/utils/getSiteMetadata.ts":
/*!***********************************************************!*\
  !*** ./src/background/providers/utils/getSiteMetadata.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSiteMetadata": () => (/* binding */ getSiteMetadata)
/* harmony export */ });
/**
 * Gets site metadata and returns it
 *
 */
async function getSiteMetadata() {
  return {
    domain: window.location.hostname,
    name: getSiteName(window),
    icon: await getSiteIcon(window)
  };
}

/**
 * Extracts a name for the site from the DOM
 */
function getSiteName(windowObject) {
  const {
    document
  } = windowObject;
  const siteName = document.querySelector('head > meta[property="og:site_name"]');
  if (siteName) {
    return siteName.content;
  }
  const metaTitle = document.querySelector('head > meta[name="title"]');
  if (metaTitle) {
    return metaTitle.content;
  }
  if (document.title && document.title.length > 0) {
    return document.title;
  }
  return window.location.hostname;
}

/**
 * Extracts an icon for the site from the DOM
 * @returns an icon URL
 */
async function getSiteIcon(windowObject) {
  const {
    document
  } = windowObject;
  const icons = document.querySelectorAll('head > link[rel~="icon"]');
  for (const icon of icons) {
    if (icon && (await imgExists(icon.href))) {
      return icon.href;
    }
  }
  return undefined;
}

/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns Whether the image exists.
 */
function imgExists(url) {
  return new Promise((resolve, reject) => {
    try {
      const img = document.createElement('img');
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

/***/ }),

/***/ "./src/background/providers/utils/onDomReady.ts":
/*!******************************************************!*\
  !*** ./src/background/providers/utils/onDomReady.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ onDomReady)
/* harmony export */ });
function onDomReady(callback) {
  if (['interactive', 'complete'].includes(document.readyState)) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback, {
      once: true
    });
  }
}

/***/ }),

/***/ "./src/background/providers/utils/onPageActivated.ts":
/*!***********************************************************!*\
  !*** ./src/background/providers/utils/onPageActivated.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ onPageActivated)
/* harmony export */ });
/**
 * Pre-rendering causes some issues with the way the extension
 * communicates with dApps. Namely, when the page is first pre-rendered,
 * content scripts are injected before the page is activated
 * by the user. Then when the user finally activates it, the connection
 * gets lost.
 *
 * This util is useful for only running certain actions after the page
 * has been activated by the user. This ensures that the connection
 * remains active.
 *
 * References:
 * https://developer.chrome.com/blog/prerender-pages/
 * https://developer.chrome.com/blog/extension-instantnav/#lifecyle
 */
function onPageActivated(callback) {
  // eslint-disable-next-line
  // @ts-ignore
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', callback, {
      once: true
    });
  } else {
    callback();
  }
}

/***/ }),

/***/ "./src/background/utils/messaging/AbstractConnection.ts":
/*!**************************************************************!*\
  !*** ./src/background/utils/messaging/AbstractConnection.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AbstractConnection)
/* harmony export */ });
/* harmony import */ var _background_connections_middlewares_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../background/connections/middlewares/models */ "./src/background/connections/middlewares/models.ts");
/* harmony import */ var eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! eth-rpc-errors */ "./node_modules/eth-rpc-errors/dist/index.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/environment */ "./src/utils/environment.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ "./src/background/utils/messaging/models.ts");





class AbstractConnection extends events__WEBPACK_IMPORTED_MODULE_2__.EventEmitter {
  #concurrentRequestLimit;
  #listenCallback;
  #waitingMap = new Map();
  constructor(concurrentRequestLimit = 1000) {
    super();
    this.#concurrentRequestLimit = concurrentRequestLimit;
  }
  connect = async listenCallback => {
    this.#listenCallback = listenCallback;
    await this._connect();
  };
  message = data => {
    this._send({
      type: 'message',
      data
    });
  };
  deferredResponse = (id, res, err) => {
    this._send({
      type: 'response',
      id,
      res,
      err
    });
  };
  request = data => {
    if (this.#waitingMap.size >= this.#concurrentRequestLimit) {
      throw eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.ethErrors.rpc.limitExceeded();
    }
    const id = crypto.randomUUID();
    const requestData = {
      ...data,
      params: {
        ...data.params,
        request: {
          ...data.params.request,
          id
        }
      },
      id
    };
    return new Promise((resolve, reject) => {
      this.#waitingMap.set(requestData.id, {
        data: requestData,
        resolve,
        reject
      });
      this._send({
        type: 'request',
        id: requestData.id,
        data: requestData
      });
    });
  };
  dispose = () => {
    for (const request of this.#waitingMap.values()) {
      request.reject(eth_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.ethErrors.provider.userRejectedRequest());
    }
    this.#waitingMap.clear();
    this._disconnect();
  };
  #onResponse = async ({
    id,
    res,
    err
  }) => {
    const request = this.#waitingMap.get(id);
    if (!request) {
      return;
    }
    const {
      resolve,
      reject
    } = request;
    this.#waitingMap.delete(id);
    if (err) {
      reject(err);
      return;
    }
    resolve(res);
  };
  onMessage = message => {
    if (message.type === 'message') {
      this.emit('message', message.data);
    } else if ((0,_models__WEBPACK_IMPORTED_MODULE_4__.isResponse)(message)) {
      this.#onResponse(message);
    } else if ((0,_models__WEBPACK_IMPORTED_MODULE_4__.isRequest)(message)) {
      this.#onRequest(message);
    }
  };
  #onRequest = async ({
    id,
    data
  }) => {
    if (!this.#listenCallback) {
      return;
    }
    let res, err;
    try {
      res = await this.#listenCallback({
        ...data
      });
    } catch (e) {
      err = {
        message: e.message
      };
      if ((0,_utils_environment__WEBPACK_IMPORTED_MODULE_3__.isDevelopment)()) {
        err.stack = e.stack;
      }
      if (e.code !== undefined) {
        err.code = e.code;
      }
      if (e.data !== undefined) {
        err.data = e.data;
      }
    }
    if (res === _background_connections_middlewares_models__WEBPACK_IMPORTED_MODULE_0__.DEFERRED_RESPONSE) {
      // the response is going to be returned as a message
      // i.e. after the user has approved / rejected the request
      return;
    }
    this._send({
      type: 'response',
      id,
      res,
      err
    });
  };
}

/***/ }),

/***/ "./src/background/utils/messaging/AutoPairingPostMessageConnection.ts":
/*!****************************************************************************!*\
  !*** ./src/background/utils/messaging/AutoPairingPostMessageConnection.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AutoPairingPostMessageConnection)
/* harmony export */ });
/* harmony import */ var _AbstractConnection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractConnection */ "./src/background/utils/messaging/AbstractConnection.ts");

const CHANNEL_BROADCAST_EVENT = 'initialize-post-message-connection';
const CHANNEL_BROADCAST_REQUEST_EVENT = 'initialize-post-message-connection-request';
class AutoPairingPostMessageConnection extends _AbstractConnection__WEBPACK_IMPORTED_MODULE_0__["default"] {
  #channel;
  #connectionId;
  #connectionReadyPromiseResolve;
  #connectionReadyPromiseReject;
  constructor(isConnectionLeader, concurrentRequestLimit = 1000) {
    super(concurrentRequestLimit);
    this.isConnectionLeader = isConnectionLeader;
    this.#channel = window;
    if (this.isConnectionLeader) {
      this.#connectionId = `PM-Connection-${crypto.randomUUID()}`;
      this.#broadcastConnectionId();
    } else {
      this.#listenForConnectionNameBroadcast();
    }
  }
  #broadcastConnectionId = () => {
    const broadcast = () => {
      this.#channel.postMessage({
        message: {
          type: CHANNEL_BROADCAST_EVENT,
          connectionId: this.#connectionId
        }
      }, window.location.origin);
    };

    // boadcast connection id immediately when connection is initialized
    broadcast();

    // listen for requests from clients initialised after the connection leader
    this.#channel.addEventListener('message', event => {
      if (event.origin !== window.location.origin || !event.data?.message || event.data.message.type !== CHANNEL_BROADCAST_REQUEST_EVENT) {
        return;
      }
      broadcast();
    });
  };
  #listenForConnectionNameBroadcast = () => {
    const handler = event => {
      if (event.origin !== window.location.origin || !event.data?.message || event.data.message.type !== CHANNEL_BROADCAST_EVENT) {
        return;
      }
      this.#connectionId = event.data.message.connectionId;
      if (this.#connectionReadyPromiseResolve) {
        this.#connectionReadyPromiseResolve();
      }
    };
    this.#channel.addEventListener('message', handler);

    // request connection leader to announce the channel ID
    this.#channel.postMessage({
      message: {
        type: CHANNEL_BROADCAST_REQUEST_EVENT
      }
    }, window.location.origin);
  };
  #messageListener = ({
    origin,
    data: {
      connectionId,
      message
    }
  }) => {
    // ignore cross origin messages and messages from other connections
    if (!this.#connectionId || origin === 'null' || origin !== window.location.origin || connectionId !== this.#connectionId || !message) {
      return;
    }
    return this.onMessage(message);
  };
  _connect = async () => {
    this.#channel.addEventListener('message', this.#messageListener);
    if (this.#connectionId) {
      return;
    }

    // wait for connection ID if not already set
    return new Promise((res, reject) => {
      this.#connectionReadyPromiseResolve = res;
      this.#connectionReadyPromiseReject = reject;
    });
  };
  _disconnect = () => {
    // reject pending connection if we have not received any connection ID till destruction
    if (!this.#connectionId && this.#connectionReadyPromiseReject) {
      this.#connectionReadyPromiseReject();
    }
    this.#channel.removeEventListener('message', this.#messageListener);
  };
  _send = message => {
    if (!this.#connectionId) {
      return;
    }
    this.#channel.postMessage({
      connectionId: this.#connectionId,
      message
    });
  };
}

/***/ }),

/***/ "./src/background/utils/messaging/models.ts":
/*!**************************************************!*\
  !*** ./src/background/utils/messaging/models.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isRequest": () => (/* binding */ isRequest),
/* harmony export */   "isResponse": () => (/* binding */ isResponse)
/* harmony export */ });
const isResponse = message => {
  return message.type === 'response';
};
const isRequest = message => {
  return message.type === 'request';
};

/***/ }),

/***/ "./src/utils/caipConversion.ts":
/*!*************************************!*\
  !*** ./src/utils/caipConversion.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AvaxCaipId": () => (/* binding */ AvaxCaipId),
/* harmony export */   "BitcoinCaipId": () => (/* binding */ BitcoinCaipId),
/* harmony export */   "CaipNamespace": () => (/* binding */ CaipNamespace),
/* harmony export */   "SolanaCaipId": () => (/* binding */ SolanaCaipId),
/* harmony export */   "caipToChainId": () => (/* binding */ caipToChainId),
/* harmony export */   "chainIdToCaip": () => (/* binding */ chainIdToCaip),
/* harmony export */   "decorateWithCaipId": () => (/* binding */ decorateWithCaipId),
/* harmony export */   "getNameSpaceFromScope": () => (/* binding */ getNameSpaceFromScope),
/* harmony export */   "getNetworkCaipId": () => (/* binding */ getNetworkCaipId),
/* harmony export */   "isBitcoinCaipId": () => (/* binding */ isBitcoinCaipId)
/* harmony export */ });
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/models.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/bitcoin.chain.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/core-chains-sdk/esm/avalanche.chain.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");


let CaipNamespace = /*#__PURE__*/function (CaipNamespace) {
  CaipNamespace["AVAX"] = "avax";
  CaipNamespace["BIP122"] = "bip122";
  CaipNamespace["EIP155"] = "eip155";
  CaipNamespace["HVM"] = "hvm";
  CaipNamespace["SOLANA"] = "solana";
  return CaipNamespace;
}({});
const BitcoinCaipId = {
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.BITCOIN]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.BitcoinCaip2ChainId.MAINNET,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.BITCOIN_TESTNET]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_2__.BitcoinCaip2ChainId.TESTNET
};
const SolanaCaipId = {
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_MAINNET_ID]: `${CaipNamespace.SOLANA}:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_DEVNET_ID]: `${CaipNamespace.SOLANA}:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.SOLANA_TESTNET_ID]: `${CaipNamespace.SOLANA}:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`
};
const AvaxCaipId = {
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_P]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_3__.AvalancheCaip2ChainId.P,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_X]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_3__.AvalancheCaip2ChainId.X,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_P]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_3__.AvalancheCaip2ChainId.P_TESTNET,
  [_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_1__.ChainId.AVALANCHE_TEST_X]: _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_3__.AvalancheCaip2ChainId.X_TESTNET
};
const getNetworkCaipId = network => {
  if (network.caipId) {
    return network.caipId;
  } else if (network.caip2Id) {
    return network.caip2Id;
  }
  if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.EVM) {
    return `eip155:${network.chainId}`;
  }
  if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.BITCOIN) {
    return BitcoinCaipId[network.chainId];
  }
  const isXChain = network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.AVM;
  const isPChain = network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.PVM;
  if (isXChain || isPChain) {
    return AvaxCaipId[network.chainId];
  }
  if (network.vmName === _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_0__.NetworkVMType.HVM) {
    return `hvm:${network.chainId}`;
  }
  throw new Error('Unsupported VM type: ' + network.vmName);
};
const caipToChainId = identifier => {
  const [namespace, reference] = identifier.split(':');
  if (!namespace) {
    throw new Error('No namespace found in identifier: ' + identifier);
  }
  if (!reference) {
    throw new Error('No reference found in identifier: ' + identifier);
  }
  if (namespace === CaipNamespace.EIP155) {
    return Number(reference);
  }
  if (reference.length === 32 && namespace === CaipNamespace.HVM) {
    return parseInt(reference.slice(0, 16), 16);
  }
  if (namespace === CaipNamespace.SOLANA) {
    const chainId = Object.keys(SolanaCaipId).find(chainIdLookup => SolanaCaipId[chainIdLookup] === identifier);
    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }
    return Number(chainId);
  }
  if (namespace === CaipNamespace.BIP122) {
    const chainId = Object.keys(BitcoinCaipId).find(chainIdLookup => BitcoinCaipId[chainIdLookup] === identifier);
    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }
    return Number(chainId);
  }
  if (namespace === CaipNamespace.AVAX) {
    const chainId = Object.keys(AvaxCaipId).find(chainIdLookup => AvaxCaipId[chainIdLookup] === identifier);
    if (!chainId) {
      throw new Error('No chainId match for CAIP identifier: ' + identifier);
    }
    return Number(chainId);
  }
  throw new Error('No chainId match for CAIP identifier: ' + identifier);
};
const chainIdToCaip = chainId => {
  return BitcoinCaipId[chainId] ?? AvaxCaipId[chainId] ?? `eip155:${chainId}`;
};
const decorateWithCaipId = network => ({
  ...network,
  caipId: getNetworkCaipId(network)
});
const getNameSpaceFromScope = scope => {
  if (!scope) {
    return null;
  }
  const [namespace] = scope.split(':');
  return namespace;
};
const isBitcoinCaipId = caipId => Object.values(BitcoinCaipId).includes(caipId);

/***/ }),

/***/ "./src/utils/environment.ts":
/*!**********************************!*\
  !*** ./src/utils/environment.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDevelopment": () => (/* binding */ isDevelopment),
/* harmony export */   "isProductionBuild": () => (/* binding */ isProductionBuild)
/* harmony export */ });
/* provided dependency */ var process = __webpack_require__(/*! ./node_modules/process/browser.js */ "./node_modules/process/browser.js");
function isDevelopment() {
  return "development" === 'development';
}
function isProductionBuild() {
  return process.env.RELEASE === 'production';
}

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/call-bind/callBound.js":
/*!*********************************************!*\
  !*** ./node_modules/call-bind/callBound.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/call-bind/node_modules/get-intrinsic/index.js");

var callBind = __webpack_require__(/*! ./ */ "./node_modules/call-bind/index.js");

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ "./node_modules/call-bind/index.js":
/*!*****************************************!*\
  !*** ./node_modules/call-bind/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "./node_modules/call-bind/node_modules/function-bind/index.js");
var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/call-bind/node_modules/get-intrinsic/index.js");

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ "./node_modules/call-bind/node_modules/function-bind/implementation.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/call-bind/node_modules/function-bind/implementation.js ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/call-bind/node_modules/function-bind/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/call-bind/node_modules/function-bind/index.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/call-bind/node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/call-bind/node_modules/get-intrinsic/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/call-bind/node_modules/get-intrinsic/index.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(/*! has-symbols */ "./node_modules/has-symbols/index.js")();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(/*! function-bind */ "./node_modules/call-bind/node_modules/function-bind/index.js");
var hasOwn = __webpack_require__(/*! has */ "./node_modules/has/src/index.js");
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/g, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ "./node_modules/console-browserify/index.js":
/*!**************************************************!*\
  !*** ./node_modules/console-browserify/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*global window, global*/
var util = __webpack_require__(/*! util */ "./node_modules/util/util.js")
var assert = __webpack_require__(/*! assert */ "./node_modules/assert/build/assert.js")
function now() { return new Date().getTime() }

var slice = Array.prototype.slice
var console
var times = {}

if (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g.console) {
    console = __webpack_require__.g.console
} else if (typeof window !== "undefined" && window.console) {
    console = window.console
} else {
    console = {}
}

var functions = [
    [log, "log"],
    [info, "info"],
    [warn, "warn"],
    [error, "error"],
    [time, "time"],
    [timeEnd, "timeEnd"],
    [trace, "trace"],
    [dir, "dir"],
    [consoleAssert, "assert"]
]

for (var i = 0; i < functions.length; i++) {
    var tuple = functions[i]
    var f = tuple[0]
    var name = tuple[1]

    if (!console[name]) {
        console[name] = f
    }
}

module.exports = console

function log() {}

function info() {
    console.log.apply(console, arguments)
}

function warn() {
    console.log.apply(console, arguments)
}

function error() {
    console.warn.apply(console, arguments)
}

function time(label) {
    times[label] = now()
}

function timeEnd(label) {
    var time = times[label]
    if (!time) {
        throw new Error("No such label: " + label)
    }

    delete times[label]
    var duration = now() - time
    console.log(label + ": " + duration + "ms")
}

function trace() {
    var err = new Error()
    err.name = "Trace"
    err.message = util.format.apply(null, arguments)
    console.error(err.stack)
}

function dir(object) {
    console.log(util.inspect(object) + "\n")
}

function consoleAssert(expression) {
    if (!expression) {
        var arr = slice.call(arguments, 1)
        assert.ok(false, util.format.apply(null, arr))
    }
}


/***/ }),

/***/ "./node_modules/define-properties/index.js":
/*!*************************************************!*\
  !*** ./node_modules/define-properties/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keys = __webpack_require__(/*! object-keys */ "./node_modules/object-keys/index.js");
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var hasPropertyDescriptors = __webpack_require__(/*! has-property-descriptors */ "./node_modules/has-property-descriptors/index.js")();

var supportsDescriptors = origDefineProperty && hasPropertyDescriptors;

var defineProperty = function (object, name, value, predicate) {
	if (name in object) {
		if (predicate === true) {
			if (object[name] === value) {
				return;
			}
		} else if (!isFunction(predicate) || !predicate()) {
			return;
		}
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value; // eslint-disable-line no-param-reassign
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;


/***/ }),

/***/ "./node_modules/es-abstract/node_modules/function-bind/implementation.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/es-abstract/node_modules/function-bind/implementation.js ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/es-abstract/node_modules/function-bind/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/es-abstract/node_modules/function-bind/index.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/es-abstract/node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/es-abstract/node_modules/get-intrinsic/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/es-abstract/node_modules/get-intrinsic/index.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(/*! has-symbols */ "./node_modules/has-symbols/index.js")();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(/*! function-bind */ "./node_modules/es-abstract/node_modules/function-bind/index.js");
var hasOwn = __webpack_require__(/*! has */ "./node_modules/has/src/index.js");
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/g, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ "./node_modules/es6-object-assign/index.js":
/*!*************************************************!*\
  !*** ./node_modules/es6-object-assign/index.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
/**
 * Code refactored from Mozilla Developer Network:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */



function assign(target, firstSource) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert first argument to object');
  }

  var to = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var nextSource = arguments[i];
    if (nextSource === undefined || nextSource === null) {
      continue;
    }

    var keysArray = Object.keys(Object(nextSource));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = nextSource[nextKey];
      }
    }
  }
  return to;
}

function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: assign
    });
  }
}

module.exports = {
  assign: assign,
  polyfill: polyfill
};


/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/classes.js":
/*!*****************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/classes.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EthereumProviderError = exports.EthereumRpcError = void 0;
const fast_safe_stringify_1 = __webpack_require__(/*! fast-safe-stringify */ "./node_modules/fast-safe-stringify/index.js");
/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
 * per EIP-1474.
 * Permits any integer error code.
 */
class EthereumRpcError extends Error {
    constructor(code, message, data) {
        if (!Number.isInteger(code)) {
            throw new Error('"code" must be an integer.');
        }
        if (!message || typeof message !== 'string') {
            throw new Error('"message" must be a nonempty string.');
        }
        super(message);
        this.code = code;
        if (data !== undefined) {
            this.data = data;
        }
    }
    /**
     * Returns a plain object with all public class properties.
     */
    serialize() {
        const serialized = {
            code: this.code,
            message: this.message,
        };
        if (this.data !== undefined) {
            serialized.data = this.data;
        }
        if (this.stack) {
            serialized.stack = this.stack;
        }
        return serialized;
    }
    /**
     * Return a string representation of the serialized error, omitting
     * any circular references.
     */
    toString() {
        return fast_safe_stringify_1.default(this.serialize(), stringifyReplacer, 2);
    }
}
exports.EthereumRpcError = EthereumRpcError;
/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 * Permits integer error codes in the [ 1000 <= 4999 ] range.
 */
class EthereumProviderError extends EthereumRpcError {
    /**
     * Create an Ethereum Provider JSON-RPC error.
     * `code` must be an integer in the 1000 <= 4999 range.
     */
    constructor(code, message, data) {
        if (!isValidEthProviderCode(code)) {
            throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
        }
        super(code, message, data);
    }
}
exports.EthereumProviderError = EthereumProviderError;
// Internal
function isValidEthProviderCode(code) {
    return Number.isInteger(code) && code >= 1000 && code <= 4999;
}
function stringifyReplacer(_, value) {
    if (value === '[Circular]') {
        return undefined;
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGFzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQUFnRDtBQVNoRDs7OztHQUlHO0FBQ0gsTUFBYSxnQkFBb0IsU0FBUSxLQUFLO0lBTTVDLFlBQVksSUFBWSxFQUFFLE9BQWUsRUFBRSxJQUFRO1FBRWpELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQ2IsNEJBQTRCLENBQzdCLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzNDLE1BQU0sSUFBSSxLQUFLLENBQ2Isc0NBQXNDLENBQ3ZDLENBQUM7U0FDSDtRQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxNQUFNLFVBQVUsR0FBK0I7WUFDN0MsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQzNCLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUM3QjtRQUNELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUMvQjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBQ04sT0FBTyw2QkFBYSxDQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLEVBQ2hCLGlCQUFpQixFQUNqQixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRERCw0Q0FzREM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLHFCQUF5QixTQUFRLGdCQUFtQjtJQUUvRDs7O09BR0c7SUFDSCxZQUFZLElBQVksRUFBRSxPQUFlLEVBQUUsSUFBUTtRQUVqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FDYiwyREFBMkQsQ0FDNUQsQ0FBQztTQUNIO1FBRUQsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBaEJELHNEQWdCQztBQUVELFdBQVc7QUFFWCxTQUFTLHNCQUFzQixDQUFDLElBQVk7SUFDMUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztBQUNoRSxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxDQUFVLEVBQUUsS0FBYztJQUNuRCxJQUFJLEtBQUssS0FBSyxZQUFZLEVBQUU7UUFDMUIsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMifQ==

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/error-constants.js":
/*!*************************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/error-constants.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorValues = exports.errorCodes = void 0;
exports.errorCodes = {
    rpc: {
        invalidInput: -32000,
        resourceNotFound: -32001,
        resourceUnavailable: -32002,
        transactionRejected: -32003,
        methodNotSupported: -32004,
        limitExceeded: -32005,
        parse: -32700,
        invalidRequest: -32600,
        methodNotFound: -32601,
        invalidParams: -32602,
        internal: -32603,
    },
    provider: {
        userRejectedRequest: 4001,
        unauthorized: 4100,
        unsupportedMethod: 4200,
        disconnected: 4900,
        chainDisconnected: 4901,
    },
};
exports.errorValues = {
    '-32700': {
        standard: 'JSON RPC 2.0',
        message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
    },
    '-32600': {
        standard: 'JSON RPC 2.0',
        message: 'The JSON sent is not a valid Request object.',
    },
    '-32601': {
        standard: 'JSON RPC 2.0',
        message: 'The method does not exist / is not available.',
    },
    '-32602': {
        standard: 'JSON RPC 2.0',
        message: 'Invalid method parameter(s).',
    },
    '-32603': {
        standard: 'JSON RPC 2.0',
        message: 'Internal JSON-RPC error.',
    },
    '-32000': {
        standard: 'EIP-1474',
        message: 'Invalid input.',
    },
    '-32001': {
        standard: 'EIP-1474',
        message: 'Resource not found.',
    },
    '-32002': {
        standard: 'EIP-1474',
        message: 'Resource unavailable.',
    },
    '-32003': {
        standard: 'EIP-1474',
        message: 'Transaction rejected.',
    },
    '-32004': {
        standard: 'EIP-1474',
        message: 'Method not supported.',
    },
    '-32005': {
        standard: 'EIP-1474',
        message: 'Request limit exceeded.',
    },
    '4001': {
        standard: 'EIP-1193',
        message: 'User rejected the request.',
    },
    '4100': {
        standard: 'EIP-1193',
        message: 'The requested account and/or method has not been authorized by the user.',
    },
    '4200': {
        standard: 'EIP-1193',
        message: 'The requested method is not supported by this Ethereum provider.',
    },
    '4900': {
        standard: 'EIP-1193',
        message: 'The provider is disconnected from all chains.',
    },
    '4901': {
        standard: 'EIP-1193',
        message: 'The provider is disconnected from the specified chain.',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9yLWNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF1QmEsUUFBQSxVQUFVLEdBQWU7SUFDcEMsR0FBRyxFQUFFO1FBQ0gsWUFBWSxFQUFFLENBQUMsS0FBSztRQUNwQixnQkFBZ0IsRUFBRSxDQUFDLEtBQUs7UUFDeEIsbUJBQW1CLEVBQUUsQ0FBQyxLQUFLO1FBQzNCLG1CQUFtQixFQUFFLENBQUMsS0FBSztRQUMzQixrQkFBa0IsRUFBRSxDQUFDLEtBQUs7UUFDMUIsYUFBYSxFQUFFLENBQUMsS0FBSztRQUNyQixLQUFLLEVBQUUsQ0FBQyxLQUFLO1FBQ2IsY0FBYyxFQUFFLENBQUMsS0FBSztRQUN0QixjQUFjLEVBQUUsQ0FBQyxLQUFLO1FBQ3RCLGFBQWEsRUFBRSxDQUFDLEtBQUs7UUFDckIsUUFBUSxFQUFFLENBQUMsS0FBSztLQUNqQjtJQUNELFFBQVEsRUFBRTtRQUNSLG1CQUFtQixFQUFFLElBQUk7UUFDekIsWUFBWSxFQUFFLElBQUk7UUFDbEIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixZQUFZLEVBQUUsSUFBSTtRQUNsQixpQkFBaUIsRUFBRSxJQUFJO0tBQ3hCO0NBQ0YsQ0FBQztBQUVXLFFBQUEsV0FBVyxHQUFHO0lBQ3pCLFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLE9BQU8sRUFBRSx1R0FBdUc7S0FDakg7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsY0FBYztRQUN4QixPQUFPLEVBQUUsOENBQThDO0tBQ3hEO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLGNBQWM7UUFDeEIsT0FBTyxFQUFFLCtDQUErQztLQUN6RDtJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLE9BQU8sRUFBRSw4QkFBOEI7S0FDeEM7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsY0FBYztRQUN4QixPQUFPLEVBQUUsMEJBQTBCO0tBQ3BDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLGdCQUFnQjtLQUMxQjtJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSxxQkFBcUI7S0FDL0I7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUsdUJBQXVCO0tBQ2pDO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLHVCQUF1QjtLQUNqQztJQUNELFFBQVEsRUFBRTtRQUNSLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSx1QkFBdUI7S0FDakM7SUFDRCxRQUFRLEVBQUU7UUFDUixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUseUJBQXlCO0tBQ25DO0lBQ0QsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLDRCQUE0QjtLQUN0QztJQUNELE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSwwRUFBMEU7S0FDcEY7SUFDRCxNQUFNLEVBQUU7UUFDTixRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUsa0VBQWtFO0tBQzVFO0lBQ0QsTUFBTSxFQUFFO1FBQ04sUUFBUSxFQUFFLFVBQVU7UUFDcEIsT0FBTyxFQUFFLCtDQUErQztLQUN6RDtJQUNELE1BQU0sRUFBRTtRQUNOLFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE9BQU8sRUFBRSx3REFBd0Q7S0FDbEU7Q0FDRixDQUFDIn0=

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/errors.js":
/*!****************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/errors.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ethErrors = void 0;
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/eth-rpc-errors/dist/utils.js");
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
exports.ethErrors = {
    rpc: {
        /**
         * Get a JSON RPC 2.0 Parse (-32700) error.
         */
        parse: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.parse, arg),
        /**
         * Get a JSON RPC 2.0 Invalid Request (-32600) error.
         */
        invalidRequest: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidRequest, arg),
        /**
         * Get a JSON RPC 2.0 Invalid Params (-32602) error.
         */
        invalidParams: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidParams, arg),
        /**
         * Get a JSON RPC 2.0 Method Not Found (-32601) error.
         */
        methodNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotFound, arg),
        /**
         * Get a JSON RPC 2.0 Internal (-32603) error.
         */
        internal: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.internal, arg),
        /**
         * Get a JSON RPC 2.0 Server error.
         * Permits integer error codes in the [ -32099 <= -32005 ] range.
         * Codes -32000 through -32004 are reserved by EIP-1474.
         */
        server: (opts) => {
            if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
                throw new Error('Ethereum RPC Server errors must provide single object argument.');
            }
            const { code } = opts;
            if (!Number.isInteger(code) || code > -32005 || code < -32099) {
                throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
            }
            return getEthJsonRpcError(code, opts);
        },
        /**
         * Get an Ethereum JSON RPC Invalid Input (-32000) error.
         */
        invalidInput: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidInput, arg),
        /**
         * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
         */
        resourceNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceNotFound, arg),
        /**
         * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
         */
        resourceUnavailable: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceUnavailable, arg),
        /**
         * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
         */
        transactionRejected: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.transactionRejected, arg),
        /**
         * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
         */
        methodNotSupported: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotSupported, arg),
        /**
         * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
         */
        limitExceeded: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.limitExceeded, arg),
    },
    provider: {
        /**
         * Get an Ethereum Provider User Rejected Request (4001) error.
         */
        userRejectedRequest: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.userRejectedRequest, arg);
        },
        /**
         * Get an Ethereum Provider Unauthorized (4100) error.
         */
        unauthorized: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.unauthorized, arg);
        },
        /**
         * Get an Ethereum Provider Unsupported Method (4200) error.
         */
        unsupportedMethod: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.unsupportedMethod, arg);
        },
        /**
         * Get an Ethereum Provider Not Connected (4900) error.
         */
        disconnected: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.disconnected, arg);
        },
        /**
         * Get an Ethereum Provider Chain Not Connected (4901) error.
         */
        chainDisconnected: (arg) => {
            return getEthProviderError(error_constants_1.errorCodes.provider.chainDisconnected, arg);
        },
        /**
         * Get a custom Ethereum Provider error.
         */
        custom: (opts) => {
            if (!opts || typeof opts !== 'object' || Array.isArray(opts)) {
                throw new Error('Ethereum Provider custom errors must provide single object argument.');
            }
            const { code, message, data } = opts;
            if (!message || typeof message !== 'string') {
                throw new Error('"message" must be a nonempty string');
            }
            return new classes_1.EthereumProviderError(code, message, data);
        },
    },
};
// Internal
function getEthJsonRpcError(code, arg) {
    const [message, data] = parseOpts(arg);
    return new classes_1.EthereumRpcError(code, message || utils_1.getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
    const [message, data] = parseOpts(arg);
    return new classes_1.EthereumProviderError(code, message || utils_1.getMessageFromCode(code), data);
}
function parseOpts(arg) {
    if (arg) {
        if (typeof arg === 'string') {
            return [arg];
        }
        else if (typeof arg === 'object' && !Array.isArray(arg)) {
            const { message, data } = arg;
            if (message && typeof message !== 'string') {
                throw new Error('Must specify string message.');
            }
            return [message || undefined, data];
        }
    }
    return [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBb0U7QUFDcEUsbUNBQTZDO0FBQzdDLHVEQUErQztBQWVsQyxRQUFBLFNBQVMsR0FBRztJQUN2QixHQUFHLEVBQUU7UUFFSDs7V0FFRztRQUNILEtBQUssRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUNyRCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUMxQjtRQUVEOztXQUVHO1FBQ0gsY0FBYyxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQzlELDRCQUFVLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQ25DO1FBRUQ7O1dBRUc7UUFDSCxhQUFhLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDN0QsNEJBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FDbEM7UUFFRDs7V0FFRztRQUNILGNBQWMsRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUM5RCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUNuQztRQUVEOztXQUVHO1FBQ0gsUUFBUSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQ3hELDRCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQzdCO1FBRUQ7Ozs7V0FJRztRQUNILE1BQU0sRUFBRSxDQUFJLElBQTJCLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1RCxNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7YUFDcEY7WUFDRCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzdELE1BQU0sSUFBSSxLQUFLLENBQ2IsK0RBQStELENBQ2hFLENBQUM7YUFDSDtZQUNELE9BQU8sa0JBQWtCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRDs7V0FFRztRQUNILFlBQVksRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUM1RCw0QkFBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUNqQztRQUVEOztXQUVHO1FBQ0gsZ0JBQWdCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDaEUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUNyQztRQUVEOztXQUVHO1FBQ0gsbUJBQW1CLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbkUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUN4QztRQUVEOztXQUVHO1FBQ0gsbUJBQW1CLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbkUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUN4QztRQUVEOztXQUVHO1FBQ0gsa0JBQWtCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FDbEUsNEJBQVUsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUN2QztRQUVEOztXQUVHO1FBQ0gsYUFBYSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQzdELDRCQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQ2xDO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFFUjs7V0FFRztRQUNILG1CQUFtQixFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFO1lBQ2hELE9BQU8sbUJBQW1CLENBQ3hCLDRCQUFVLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsQ0FDN0MsQ0FBQztRQUNKLENBQUM7UUFFRDs7V0FFRztRQUNILFlBQVksRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRTtZQUN6QyxPQUFPLG1CQUFtQixDQUN4Qiw0QkFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUN0QyxDQUFDO1FBQ0osQ0FBQztRQUVEOztXQUVHO1FBQ0gsaUJBQWlCLEVBQUUsQ0FBSSxHQUFxQixFQUFFLEVBQUU7WUFDOUMsT0FBTyxtQkFBbUIsQ0FDeEIsNEJBQVUsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUMzQyxDQUFDO1FBQ0osQ0FBQztRQUVEOztXQUVHO1FBQ0gsWUFBWSxFQUFFLENBQUksR0FBcUIsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sbUJBQW1CLENBQ3hCLDRCQUFVLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQ3RDLENBQUM7UUFDSixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxpQkFBaUIsRUFBRSxDQUFJLEdBQXFCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLG1CQUFtQixDQUN4Qiw0QkFBVSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQzNDLENBQUM7UUFDSixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxNQUFNLEVBQUUsQ0FBSSxJQUF1QixFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO2FBQ3pGO1lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRXJDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUMzQyxNQUFNLElBQUksS0FBSyxDQUNiLHFDQUFxQyxDQUN0QyxDQUFDO2FBQ0g7WUFDRCxPQUFPLElBQUksK0JBQXFCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsV0FBVztBQUVYLFNBQVMsa0JBQWtCLENBQUksSUFBWSxFQUFFLEdBQXFCO0lBQ2hFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sSUFBSSwwQkFBZ0IsQ0FDekIsSUFBSSxFQUNKLE9BQU8sSUFBSSwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFDbkMsSUFBSSxDQUNMLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBSSxJQUFZLEVBQUUsR0FBcUI7SUFDakUsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsT0FBTyxJQUFJLCtCQUFxQixDQUM5QixJQUFJLEVBQ0osT0FBTyxJQUFJLDBCQUFrQixDQUFDLElBQUksQ0FBQyxFQUNuQyxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBSSxHQUFxQjtJQUN6QyxJQUFJLEdBQUcsRUFBRTtRQUNQLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO2FBQU0sSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3pELE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBRTlCLElBQUksT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDMUMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2FBQ2pEO1lBQ0QsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckM7S0FDRjtJQUNELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyJ9

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMessageFromCode = exports.serializeError = exports.EthereumProviderError = exports.EthereumRpcError = exports.ethErrors = exports.errorCodes = void 0;
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
Object.defineProperty(exports, "EthereumRpcError", ({ enumerable: true, get: function () { return classes_1.EthereumRpcError; } }));
Object.defineProperty(exports, "EthereumProviderError", ({ enumerable: true, get: function () { return classes_1.EthereumProviderError; } }));
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/eth-rpc-errors/dist/utils.js");
Object.defineProperty(exports, "serializeError", ({ enumerable: true, get: function () { return utils_1.serializeError; } }));
Object.defineProperty(exports, "getMessageFromCode", ({ enumerable: true, get: function () { return utils_1.getMessageFromCode; } }));
const errors_1 = __webpack_require__(/*! ./errors */ "./node_modules/eth-rpc-errors/dist/errors.js");
Object.defineProperty(exports, "ethErrors", ({ enumerable: true, get: function () { return errors_1.ethErrors; } }));
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
Object.defineProperty(exports, "errorCodes", ({ enumerable: true, get: function () { return error_constants_1.errorCodes; } }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQW9FO0FBVWxFLGlHQVZPLDBCQUFnQixPQVVQO0FBQ2hCLHNHQVh5QiwrQkFBcUIsT0FXekI7QUFWdkIsbUNBRWlCO0FBU2YsK0ZBVkEsc0JBQWMsT0FVQTtBQUNkLG1HQVhnQiwwQkFBa0IsT0FXaEI7QUFUcEIscUNBQXFDO0FBS25DLDBGQUxPLGtCQUFTLE9BS1A7QUFKWCx1REFBK0M7QUFHN0MsMkZBSE8sNEJBQVUsT0FHUCJ9

/***/ }),

/***/ "./node_modules/eth-rpc-errors/dist/utils.js":
/*!***************************************************!*\
  !*** ./node_modules/eth-rpc-errors/dist/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serializeError = exports.isValidCode = exports.getMessageFromCode = exports.JSON_RPC_SERVER_ERROR_MESSAGE = void 0;
const error_constants_1 = __webpack_require__(/*! ./error-constants */ "./node_modules/eth-rpc-errors/dist/error-constants.js");
const classes_1 = __webpack_require__(/*! ./classes */ "./node_modules/eth-rpc-errors/dist/classes.js");
const FALLBACK_ERROR_CODE = error_constants_1.errorCodes.rpc.internal;
const FALLBACK_MESSAGE = 'Unspecified error message. This is a bug, please report it.';
const FALLBACK_ERROR = {
    code: FALLBACK_ERROR_CODE,
    message: getMessageFromCode(FALLBACK_ERROR_CODE),
};
exports.JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.';
/**
 * Gets the message for a given code, or a fallback message if the code has
 * no corresponding message.
 */
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
    if (Number.isInteger(code)) {
        const codeString = code.toString();
        if (hasKey(error_constants_1.errorValues, codeString)) {
            return error_constants_1.errorValues[codeString].message;
        }
        if (isJsonRpcServerError(code)) {
            return exports.JSON_RPC_SERVER_ERROR_MESSAGE;
        }
    }
    return fallbackMessage;
}
exports.getMessageFromCode = getMessageFromCode;
/**
 * Returns whether the given code is valid.
 * A code is only valid if it has a message.
 */
function isValidCode(code) {
    if (!Number.isInteger(code)) {
        return false;
    }
    const codeString = code.toString();
    if (error_constants_1.errorValues[codeString]) {
        return true;
    }
    if (isJsonRpcServerError(code)) {
        return true;
    }
    return false;
}
exports.isValidCode = isValidCode;
/**
 * Serializes the given error to an Ethereum JSON RPC-compatible error object.
 * Merely copies the given error's values if it is already compatible.
 * If the given error is not fully compatible, it will be preserved on the
 * returned object's data.originalError property.
 */
function serializeError(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = false, } = {}) {
    var _a, _b;
    if (!fallbackError ||
        !Number.isInteger(fallbackError.code) ||
        typeof fallbackError.message !== 'string') {
        throw new Error('Must provide fallback error with integer number code and string message.');
    }
    if (error instanceof classes_1.EthereumRpcError) {
        return error.serialize();
    }
    const serialized = {};
    if (error &&
        typeof error === 'object' &&
        !Array.isArray(error) &&
        hasKey(error, 'code') &&
        isValidCode(error.code)) {
        const _error = error;
        serialized.code = _error.code;
        if (_error.message && typeof _error.message === 'string') {
            serialized.message = _error.message;
            if (hasKey(_error, 'data')) {
                serialized.data = _error.data;
            }
        }
        else {
            serialized.message = getMessageFromCode(serialized.code);
            serialized.data = { originalError: assignOriginalError(error) };
        }
    }
    else {
        serialized.code = fallbackError.code;
        const message = (_a = error) === null || _a === void 0 ? void 0 : _a.message;
        serialized.message = (message && typeof message === 'string'
            ? message
            : fallbackError.message);
        serialized.data = { originalError: assignOriginalError(error) };
    }
    const stack = (_b = error) === null || _b === void 0 ? void 0 : _b.stack;
    if (shouldIncludeStack && error && stack && typeof stack === 'string') {
        serialized.stack = stack;
    }
    return serialized;
}
exports.serializeError = serializeError;
// Internal
function isJsonRpcServerError(code) {
    return code >= -32099 && code <= -32000;
}
function assignOriginalError(error) {
    if (error && typeof error === 'object' && !Array.isArray(error)) {
        return Object.assign({}, error);
    }
    return error;
}
function hasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdURBQTREO0FBQzVELHVDQUF5RTtBQUV6RSxNQUFNLG1CQUFtQixHQUFHLDRCQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNwRCxNQUFNLGdCQUFnQixHQUFHLDZEQUE2RCxDQUFDO0FBQ3ZGLE1BQU0sY0FBYyxHQUErQjtJQUNqRCxJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQztDQUNqRCxDQUFDO0FBRVcsUUFBQSw2QkFBNkIsR0FBRywyQkFBMkIsQ0FBQztBQUl6RTs7O0dBR0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsSUFBWSxFQUNaLGtCQUEwQixnQkFBZ0I7SUFFMUMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVuQyxJQUFJLE1BQU0sQ0FBQyw2QkFBVyxFQUFFLFVBQVUsQ0FBQyxFQUFFO1lBQ25DLE9BQU8sNkJBQVcsQ0FBQyxVQUEyQixDQUFDLENBQUMsT0FBTyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLHFDQUE2QixDQUFDO1NBQ3RDO0tBQ0Y7SUFDRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBZkQsZ0RBZUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixXQUFXLENBQUMsSUFBWTtJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25DLElBQUksNkJBQVcsQ0FBQyxVQUEyQixDQUFDLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWRELGtDQWNDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixjQUFjLENBQzVCLEtBQWMsRUFDZCxFQUNFLGFBQWEsR0FBRyxjQUFjLEVBQzlCLGtCQUFrQixHQUFHLEtBQUssR0FDM0IsR0FBRyxFQUFFOztJQUdOLElBQ0UsQ0FBQyxhQUFhO1FBQ2QsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDckMsT0FBTyxhQUFhLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFDekM7UUFDQSxNQUFNLElBQUksS0FBSyxDQUNiLDBFQUEwRSxDQUMzRSxDQUFDO0tBQ0g7SUFFRCxJQUFJLEtBQUssWUFBWSwwQkFBZ0IsRUFBRTtRQUNyQyxPQUFPLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUMxQjtJQUVELE1BQU0sVUFBVSxHQUF3QyxFQUFFLENBQUM7SUFFM0QsSUFDRSxLQUFLO1FBQ0wsT0FBTyxLQUFLLEtBQUssUUFBUTtRQUN6QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxLQUFnQyxFQUFFLE1BQU0sQ0FBQztRQUNoRCxXQUFXLENBQUUsS0FBb0MsQ0FBQyxJQUFJLENBQUMsRUFDdkQ7UUFDQSxNQUFNLE1BQU0sR0FBRyxLQUE0QyxDQUFDO1FBQzVELFVBQVUsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUU5QixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUN4RCxVQUFVLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFFcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUMxQixVQUFVLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7YUFDL0I7U0FDRjthQUFNO1lBQ0wsVUFBVSxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FDcEMsVUFBeUMsQ0FBQyxJQUFJLENBQ2hELENBQUM7WUFFRixVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7U0FDakU7S0FDRjtTQUFNO1FBQ0wsVUFBVSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBRXJDLE1BQU0sT0FBTyxTQUFJLEtBQWEsMENBQUUsT0FBTyxDQUFDO1FBRXhDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FDbkIsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7WUFDcEMsQ0FBQyxDQUFDLE9BQU87WUFDVCxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FDMUIsQ0FBQztRQUNGLFVBQVUsQ0FBQyxJQUFJLEdBQUcsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztLQUNqRTtJQUVELE1BQU0sS0FBSyxTQUFJLEtBQWEsMENBQUUsS0FBSyxDQUFDO0lBRXBDLElBQUksa0JBQWtCLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDckUsVUFBVSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDMUI7SUFDRCxPQUFPLFVBQXdDLENBQUM7QUFDbEQsQ0FBQztBQWxFRCx3Q0FrRUM7QUFFRCxXQUFXO0FBRVgsU0FBUyxvQkFBb0IsQ0FBQyxJQUFZO0lBQ3hDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQyxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFjO0lBQ3pDLElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDL0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNqQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsTUFBTSxDQUFDLEdBQTRCLEVBQUUsR0FBVztJQUN2RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEQsQ0FBQyJ9

/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/fast-safe-stringify/index.js":
/*!***************************************************!*\
  !*** ./node_modules/fast-safe-stringify/index.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}


/***/ }),

/***/ "./node_modules/for-each/index.js":
/*!****************************************!*\
  !*** ./node_modules/for-each/index.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isCallable = __webpack_require__(/*! is-callable */ "./node_modules/is-callable/index.js");

var toStr = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

var forEachArray = function forEachArray(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            if (receiver == null) {
                iterator(array[i], i, array);
            } else {
                iterator.call(receiver, array[i], i, array);
            }
        }
    }
};

var forEachString = function forEachString(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        if (receiver == null) {
            iterator(string.charAt(i), i, string);
        } else {
            iterator.call(receiver, string.charAt(i), i, string);
        }
    }
};

var forEachObject = function forEachObject(object, iterator, receiver) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            if (receiver == null) {
                iterator(object[k], k, object);
            } else {
                iterator.call(receiver, object[k], k, object);
            }
        }
    }
};

var forEach = function forEach(list, iterator, thisArg) {
    if (!isCallable(iterator)) {
        throw new TypeError('iterator must be a function');
    }

    var receiver;
    if (arguments.length >= 3) {
        receiver = thisArg;
    }

    if (toStr.call(list) === '[object Array]') {
        forEachArray(list, iterator, receiver);
    } else if (typeof list === 'string') {
        forEachString(list, iterator, receiver);
    } else {
        forEachObject(list, iterator, receiver);
    }
};

module.exports = forEach;


/***/ }),

/***/ "./node_modules/has-property-descriptors/index.js":
/*!********************************************************!*\
  !*** ./node_modules/has-property-descriptors/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/has-property-descriptors/node_modules/get-intrinsic/index.js");

var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	if ($defineProperty) {
		try {
			$defineProperty({}, 'a', { value: 1 });
			return true;
		} catch (e) {
			// IE 8 has a broken defineProperty
			return false;
		}
	}
	return false;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!hasPropertyDescriptors()) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;


/***/ }),

/***/ "./node_modules/has-property-descriptors/node_modules/function-bind/implementation.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/has-property-descriptors/node_modules/function-bind/implementation.js ***!
  \********************************************************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/has-property-descriptors/node_modules/function-bind/index.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/has-property-descriptors/node_modules/function-bind/index.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/has-property-descriptors/node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/has-property-descriptors/node_modules/get-intrinsic/index.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/has-property-descriptors/node_modules/get-intrinsic/index.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(/*! has-symbols */ "./node_modules/has-symbols/index.js")();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(/*! function-bind */ "./node_modules/has-property-descriptors/node_modules/function-bind/index.js");
var hasOwn = __webpack_require__(/*! has */ "./node_modules/has/src/index.js");
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/g, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ "./node_modules/has-symbols/index.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(/*! ./shams */ "./node_modules/has-symbols/shams.js");

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ "./node_modules/has-symbols/shams.js":
/*!*******************************************!*\
  !*** ./node_modules/has-symbols/shams.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ "./node_modules/has-tostringtag/shams.js":
/*!***********************************************!*\
  !*** ./node_modules/has-tostringtag/shams.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasSymbols = __webpack_require__(/*! has-symbols/shams */ "./node_modules/has-symbols/shams.js");

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};


/***/ }),

/***/ "./node_modules/has/node_modules/function-bind/implementation.js":
/*!***********************************************************************!*\
  !*** ./node_modules/has/node_modules/function-bind/implementation.js ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "./node_modules/has/node_modules/function-bind/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/has/node_modules/function-bind/index.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/has/node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "./node_modules/has/src/index.js":
/*!***************************************!*\
  !*** ./node_modules/has/src/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "./node_modules/has/node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/is-arguments/index.js":
/*!********************************************!*\
  !*** ./node_modules/is-arguments/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;


/***/ }),

/***/ "./node_modules/is-callable/index.js":
/*!*******************************************!*\
  !*** ./node_modules/is-callable/index.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


var fnToStr = Function.prototype.toString;
var reflectApply = typeof Reflect === 'object' && Reflect !== null && Reflect.apply;
var badArrayLike;
var isCallableMarker;
if (typeof reflectApply === 'function' && typeof Object.defineProperty === 'function') {
	try {
		badArrayLike = Object.defineProperty({}, 'length', {
			get: function () {
				throw isCallableMarker;
			}
		});
		isCallableMarker = {};
		// eslint-disable-next-line no-throw-literal
		reflectApply(function () { throw 42; }, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) {
			reflectApply = null;
		}
	}
} else {
	reflectApply = null;
}

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && !!Symbol.toStringTag; // better: use `has-tostringtag`
/* globals document: false */
var documentDotAll = typeof document === 'object' && typeof document.all === 'undefined' && document.all !== undefined ? document.all : {};

module.exports = reflectApply
	? function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) { return false; }
		}
		return !isES6ClassFn(value);
	}
	: function isCallable(value) {
		if (value === documentDotAll) { return true; }
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (typeof value === 'function' && !value.prototype) { return true; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ }),

/***/ "./node_modules/is-generator-function/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/is-generator-function/index.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};


/***/ }),

/***/ "./node_modules/is-nan/implementation.js":
/*!***********************************************!*\
  !*** ./node_modules/is-nan/implementation.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";


/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function isNaN(value) {
	return value !== value;
};


/***/ }),

/***/ "./node_modules/is-nan/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-nan/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var callBind = __webpack_require__(/*! call-bind */ "./node_modules/call-bind/index.js");
var define = __webpack_require__(/*! define-properties */ "./node_modules/define-properties/index.js");

var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/is-nan/implementation.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/is-nan/polyfill.js");
var shim = __webpack_require__(/*! ./shim */ "./node_modules/is-nan/shim.js");

var polyfill = callBind(getPolyfill(), Number);

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;


/***/ }),

/***/ "./node_modules/is-nan/polyfill.js":
/*!*****************************************!*\
  !*** ./node_modules/is-nan/polyfill.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/is-nan/implementation.js");

module.exports = function getPolyfill() {
	if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
		return Number.isNaN;
	}
	return implementation;
};


/***/ }),

/***/ "./node_modules/is-nan/shim.js":
/*!*************************************!*\
  !*** ./node_modules/is-nan/shim.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(/*! define-properties */ "./node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/is-nan/polyfill.js");

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

module.exports = function shimNumberIsNaN() {
	var polyfill = getPolyfill();
	define(Number, { isNaN: polyfill }, {
		isNaN: function testIsNaN() {
			return Number.isNaN !== polyfill;
		}
	});
	return polyfill;
};


/***/ }),

/***/ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/object-is/implementation.js":
/*!**************************************************!*\
  !*** ./node_modules/object-is/implementation.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


var numberIsNaN = function (value) {
	return value !== value;
};

module.exports = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	}
	if (a === b) {
		return true;
	}
	if (numberIsNaN(a) && numberIsNaN(b)) {
		return true;
	}
	return false;
};



/***/ }),

/***/ "./node_modules/object-is/index.js":
/*!*****************************************!*\
  !*** ./node_modules/object-is/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var define = __webpack_require__(/*! define-properties */ "./node_modules/define-properties/index.js");
var callBind = __webpack_require__(/*! call-bind */ "./node_modules/call-bind/index.js");

var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/object-is/implementation.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/object-is/polyfill.js");
var shim = __webpack_require__(/*! ./shim */ "./node_modules/object-is/shim.js");

var polyfill = callBind(getPolyfill(), Object);

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;


/***/ }),

/***/ "./node_modules/object-is/polyfill.js":
/*!********************************************!*\
  !*** ./node_modules/object-is/polyfill.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "./node_modules/object-is/implementation.js");

module.exports = function getPolyfill() {
	return typeof Object.is === 'function' ? Object.is : implementation;
};


/***/ }),

/***/ "./node_modules/object-is/shim.js":
/*!****************************************!*\
  !*** ./node_modules/object-is/shim.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var getPolyfill = __webpack_require__(/*! ./polyfill */ "./node_modules/object-is/polyfill.js");
var define = __webpack_require__(/*! define-properties */ "./node_modules/define-properties/index.js");

module.exports = function shimObjectIs() {
	var polyfill = getPolyfill();
	define(Object, { is: polyfill }, {
		is: function testObjectIs() {
			return Object.is !== polyfill;
		}
	});
	return polyfill;
};


/***/ }),

/***/ "./node_modules/object-keys/implementation.js":
/*!****************************************************!*\
  !*** ./node_modules/object-keys/implementation.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(/*! ./isArguments */ "./node_modules/object-keys/isArguments.js"); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),

/***/ "./node_modules/object-keys/index.js":
/*!*******************************************!*\
  !*** ./node_modules/object-keys/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(/*! ./isArguments */ "./node_modules/object-keys/isArguments.js");

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(/*! ./implementation */ "./node_modules/object-keys/implementation.js");

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),

/***/ "./node_modules/object-keys/isArguments.js":
/*!*************************************************!*\
  !*** ./node_modules/object-keys/isArguments.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/util/node_modules/is-typed-array/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/util/node_modules/is-typed-array/index.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(/*! for-each */ "./node_modules/for-each/index.js");
var availableTypedArrays = __webpack_require__(/*! available-typed-arrays */ "./node_modules/available-typed-arrays/index.js");
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = __webpack_require__(/*! es-abstract/helpers/getOwnPropertyDescriptor */ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js");
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr) {
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};


/***/ }),

/***/ "./node_modules/util/node_modules/which-typed-array/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/util/node_modules/which-typed-array/index.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var forEach = __webpack_require__(/*! for-each */ "./node_modules/for-each/index.js");
var availableTypedArrays = __webpack_require__(/*! available-typed-arrays */ "./node_modules/available-typed-arrays/index.js");
var callBound = __webpack_require__(/*! call-bind/callBound */ "./node_modules/call-bind/callBound.js");

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = __webpack_require__(/*! has-tostringtag/shams */ "./node_modules/has-tostringtag/shams.js")();

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;
var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = __webpack_require__(/*! es-abstract/helpers/getOwnPropertyDescriptor */ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js");
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof g[typedArray] === 'function') {
			var arr = new g[typedArray]();
			if (Symbol.toStringTag in arr) {
				var proto = getPrototypeOf(arr);
				var descriptor = gOPD(proto, Symbol.toStringTag);
				if (!descriptor) {
					var superProto = getPrototypeOf(proto);
					descriptor = gOPD(superProto, Symbol.toStringTag);
				}
				toStrTags[typedArray] = descriptor.get;
			}
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = __webpack_require__(/*! is-typed-array */ "./node_modules/util/node_modules/is-typed-array/index.js");

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag || !(Symbol.toStringTag in value)) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};


/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/***/ ((module) => {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),

/***/ "./node_modules/util/support/types.js":
/*!********************************************!*\
  !*** ./node_modules/util/support/types.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9



var isArgumentsObject = __webpack_require__(/*! is-arguments */ "./node_modules/is-arguments/index.js");
var isGeneratorFunction = __webpack_require__(/*! is-generator-function */ "./node_modules/is-generator-function/index.js");
var whichTypedArray = __webpack_require__(/*! which-typed-array */ "./node_modules/util/node_modules/which-typed-array/index.js");
var isTypedArray = __webpack_require__(/*! is-typed-array */ "./node_modules/util/node_modules/is-typed-array/index.js");

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});


/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(/*! ./node_modules/process/browser.js */ "./node_modules/process/browser.js");
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').slice(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.slice(1, -1);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = __webpack_require__(/*! ./support/types */ "./node_modules/util/support/types.js");

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;


/***/ }),

/***/ "./node_modules/available-typed-arrays/index.js":
/*!******************************************************!*\
  !*** ./node_modules/available-typed-arrays/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

var g = typeof globalThis === 'undefined' ? __webpack_require__.g : globalThis;

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof g[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};


/***/ }),

/***/ "./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(/*! get-intrinsic */ "./node_modules/es-abstract/node_modules/get-intrinsic/index.js");

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ "./node_modules/@avalabs/evm-module/dist/chunk-7VP42LRT.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@avalabs/evm-module/dist/chunk-7VP42LRT.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ h),
/* harmony export */   "b": () => (/* binding */ i),
/* harmony export */   "c": () => (/* binding */ j),
/* harmony export */   "d": () => (/* binding */ k),
/* harmony export */   "e": () => (/* binding */ l)
/* harmony export */ });
var f=Object.defineProperty;var g=(b,a,c)=>a in b?f(b,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):b[a]=c;var h=(b,a,c)=>(g(b,typeof a!="symbol"?a+"":a,c),c),d=(b,a,c)=>{if(!a.has(b))throw TypeError("Cannot "+c)};var i=(b,a,c)=>(d(b,a,"read from private field"),c?c.call(b):a.get(b)),j=(b,a,c)=>{if(a.has(b))throw TypeError("Cannot add the same private member more than once");a instanceof WeakSet?a.add(b):a.set(b,c);},k=(b,a,c,e)=>(d(b,a,"write to private field"),e?e.call(b,c):a.set(b,c),c);var l=(b,a,c)=>(d(b,a,"access private method"),c);


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-7VP42LRT.js.map

/***/ }),

/***/ "./node_modules/@avalabs/evm-module/dist/provider/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@avalabs/evm-module/dist/provider/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EVMProvider": () => (/* binding */ D)
/* harmony export */ });
/* harmony import */ var _chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../chunk-7VP42LRT.js */ "./node_modules/@avalabs/evm-module/dist/chunk-7VP42LRT.js");
/* harmony import */ var _metamask_rpc_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @metamask/rpc-errors */ "./node_modules/@metamask/rpc-errors/dist/index.mjs");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");





var d,l,E=class{constructor(a$1){(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,d,new Map);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,l,[]);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"check",a=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,d).has(a)&&(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,d).delete(a),this._proceed();});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"uncheck",a=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,d).set(a,!0);});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_proceed",()=>{if(!(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,d).size)for(;(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,l).length;){let a=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,l).shift();a?.resolve(a?.fn());}});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"call",a=>new Promise(e=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,l).push({fn:a,resolve:e}),this._proceed();}));a$1.map(e=>(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,d).set(e,!0));}};d=new WeakMap,l=new WeakMap;var p,c,v,S,A,m,y,P,u,C,I,_,f,D=class extends events__WEBPACK_IMPORTED_MODULE_2__{constructor({maxListeners:e$1=100,info:s,walletVersion:r}){super();(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,v);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,p,new E(["provider_state_loaded"]));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,c,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"info");(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"chainId",null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"selectedAddress",null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"networkVersion",null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"isAvalanche",!0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"isMetaMask",!0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"walletVersion",null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_isReady",!1);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_isConnected",!1);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_initialized",!1);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_isUnlocked",!1);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_sessionId",crypto.randomUUID());(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_state",{accounts:null,isConnected:!1,isUnlocked:!1,initialized:!1});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"_metamask",{isUnlocked:()=>Promise.resolve(this._isUnlocked)});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,A,async()=>{try{let e=await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,m).call(this,{method:"avalanche_getProviderState"}),{chainId:s,accounts:r,networkVersion:o,isUnlocked:g}=e??{};g&&(this._isUnlocked=!0,this._state.isUnlocked=!0),s&&s!=="0x0"&&o&&o!=="loading"&&(this.chainId=s,this.networkVersion=o,(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).call(this,{chainId:s}),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f).call(this,{chainId:s,networkVersion:o})),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,_).call(this,r||[]),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p).check("provider_state_loaded");}catch{}finally{this._initialized=!0,this._state.initialized=!0,this._isReady=!0,this.emit("_initialized");}});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,m,async e=>e.method==="eth_chainId"?this.chainId:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,c)?.request({data:e,scope:`eip155:${this.chainId}`,sessionId:this._sessionId}));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,y,e=>({connect:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u),disconnect:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,I),accountsChanged:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,_),chainChanged:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f),avalanche_unlockStateChanged:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,C)})[e]);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,P,({method:e,params:s})=>{let r=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,y).call(this,e);if(r)return r(s);this.emit(e,s);});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"isConnected",()=>!0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"request",async e=>(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p).call(()=>(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,m).call(this,e)));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"sendAsync",(e,s)=>{if(Array.isArray(e))return Promise.all(e.map(h=>new Promise(U=>{this.sendAsync(h,(V,q)=>{U(q);});}))).then(h=>s(null,h));let{method:r,params:o,...g}=e;this.request({method:r,params:o}).then(h=>s(null,{...g,method:r,result:h})).catch(h=>s(h,{...g,method:r,error:h}));});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"send",(e,s)=>{if(typeof e=="string"&&(!s||Array.isArray(s)))return this.request({method:e,params:s}).then(o=>({id:void 0,jsonrpc:"2.0",result:o}));if(typeof e=="object"&&typeof s=="function")return this.sendAsync(e,s);let r;switch(e.method){case"eth_chainId":r=this.chainId;break;case"eth_accounts":r=this.selectedAddress?[this.selectedAddress]:[];break;case"eth_coinbase":r=this.selectedAddress||null;break;default:throw new Error("Sync method not supported. Please provide a callback or use the `request` function.")}return {id:e.id,jsonrpc:e.jsonrpc,result:r}});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"enable",()=>this.request({method:"eth_requestAccounts"}));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"net_version",()=>this.request({method:"net_version"}));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,u,e=>{this._isConnected||(this._isConnected=!0,this._state.isConnected=!0,this.emit("connect",e));});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,C,({accounts:e,isUnlocked:s})=>{s?(this._isUnlocked=!0,this._state.isUnlocked=!0,(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,_).call(this,e)):this._isUnlocked=!1;});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,I,()=>{this._isConnected=!1,this._state.isConnected=!1,this._state.accounts=null,this.selectedAddress=null;let e=_metamask_rpc_errors__WEBPACK_IMPORTED_MODULE_1__.providerErrors.disconnected();this.emit("accountsChanged",[]),this.emit("disconnect",e),this.emit("close",e);});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,_,e=>{e?.[0]!==this.selectedAddress&&(this.selectedAddress=e?.[0]??null,this._state.accounts=e,this.emit("accountsChanged",e));});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,f,({chainId:e,networkVersion:s})=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).call(this,{chainId:e}),e!==this.chainId&&(this.chainId=e,this.emit("chainChanged",e)),s!==this.networkVersion&&(this.networkVersion=s,this.emit("networkChanged",s));});this.info=s,this.walletVersion=r??null,this.setMaxListeners(e$1),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,v,S).call(this);}};p=new WeakMap,c=new WeakMap,v=new WeakSet,S=function(){window.addEventListener(_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.EventNames.CORE_WALLET_ANNOUNCE_PROVIDER,e=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,c)||((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,c,e.detail.provider),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,c)?.subscribeToMessage((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,P)),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,A).call(this));}),window.dispatchEvent(new Event(_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_3__.EventNames.CORE_WALLET_REQUEST_PROVIDER));},A=new WeakMap,m=new WeakMap,y=new WeakMap,P=new WeakMap,u=new WeakMap,C=new WeakMap,I=new WeakMap,_=new WeakMap,f=new WeakMap;


//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@avalabs/svm-module/dist/chunk-7VP42LRT.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@avalabs/svm-module/dist/chunk-7VP42LRT.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ h),
/* harmony export */   "b": () => (/* binding */ i),
/* harmony export */   "c": () => (/* binding */ j),
/* harmony export */   "d": () => (/* binding */ k),
/* harmony export */   "e": () => (/* binding */ l)
/* harmony export */ });
var f=Object.defineProperty;var g=(b,a,c)=>a in b?f(b,a,{enumerable:!0,configurable:!0,writable:!0,value:c}):b[a]=c;var h=(b,a,c)=>(g(b,typeof a!="symbol"?a+"":a,c),c),d=(b,a,c)=>{if(!a.has(b))throw TypeError("Cannot "+c)};var i=(b,a,c)=>(d(b,a,"read from private field"),c?c.call(b):a.get(b)),j=(b,a,c)=>{if(a.has(b))throw TypeError("Cannot add the same private member more than once");a instanceof WeakSet?a.add(b):a.set(b,c);},k=(b,a,c,e)=>(d(b,a,"write to private field"),e?e.call(b,c):a.set(b,c),c);var l=(b,a,c)=>(d(b,a,"access private method"),c);


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-7VP42LRT.js.map

/***/ }),

/***/ "./node_modules/@avalabs/svm-module/dist/provider/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@avalabs/svm-module/dist/provider/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SolanaWalletProvider": () => (/* binding */ Z),
/* harmony export */   "initialize": () => (/* binding */ Yn)
/* harmony export */ });
/* harmony import */ var _chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../chunk-7VP42LRT.js */ "./node_modules/@avalabs/svm-module/dist/chunk-7VP42LRT.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var _avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @avalabs/vm-module-types */ "./node_modules/@avalabs/vm-module-types/dist/index.js");
/* harmony import */ var _scure_base__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @scure/base */ "./node_modules/@scure/base/lib/esm/index.js");
/* harmony import */ var _solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/wallet-standard-features */ "./node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js");
/* harmony import */ var _solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @solana/wallet-standard-features */ "./node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js");
/* harmony import */ var _wallet_standard_features__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wallet-standard/features */ "./node_modules/@wallet-standard/features/lib/esm/connect.js");
/* harmony import */ var _wallet_standard_features__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wallet-standard/features */ "./node_modules/@wallet-standard/features/lib/esm/disconnect.js");
/* harmony import */ var _wallet_standard_features__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wallet-standard/features */ "./node_modules/@wallet-standard/features/lib/esm/events.js");
/* harmony import */ var _avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @avalabs/core-chains-sdk */ "./node_modules/@avalabs/svm-module/node_modules/@avalabs/core-chains-sdk/esm/solana.chain.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! ./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js */ "./node_modules/node-polyfill-webpack-plugin/node_modules/buffer/index.js")["Buffer"];
/* provided dependency */ var console = __webpack_require__(/*! ./node_modules/console-browserify/index.js */ "./node_modules/console-browserify/index.js");








var x=o=>{let e=Buffer.from(_scure_base__WEBPACK_IMPORTED_MODULE_3__.base58.decode(o));return {get[Symbol.toStringTag](){return `PublicKey(${this.toString()})`},toBase58:()=>o,toBuffer:()=>e,toBytes:()=>e,toJSON:()=>o,toString:()=>o,equals:a=>o===a.toBase58(),encode:()=>e}};var u,m,K,O,M,Z=class extends events__WEBPACK_IMPORTED_MODULE_1__{constructor(t,{icon:a$1,version:r,name:c$1}){super();(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.a)(this,"publicKey",null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,u,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,m,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,K,t=>{let a=t.find(({vm:r})=>r===_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.NetworkVMType.SVM)?.address;a?this.publicKey?(this.publicKey=x(a),this.emit("accountChanged")):(this.publicKey=x(a),this.emit("connect")):this.disconnect();});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,O,t=>({connect:this.connect,disconnect:this.disconnect,accountsChangedCA:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,K)})[t]??(()=>{}));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,M,({method:t,params:a})=>{let r=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,O).call(this,t);if(r)return r(a);this.emit(t,a);});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,m,{icon:a$1,name:c$1,version:r}),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,u,t),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).subscribeToMessage((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,M));}get info(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,m)}async connect({onlyIfTrusted:t}={}){if(this.publicKey)return {publicKey:this.publicKey};let[a]=await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).request({data:{method:"wallet_requestAccountPermission",params:{addressVM:_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.NetworkVMType.SVM,onlyIfTrusted:t}}});return this.publicKey=x(a),{publicKey:this.publicKey}}async disconnect(){this.publicKey=null,this.emit("disconnect");}async signAndSendTransaction(t,a,r,c){return await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).request({scope:a,data:{method:_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION,params:[{account:t,serializedTx:r,sendOptions:c}]}})}async signTransaction(t,a,r){return await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,u).request({scope:a,data:{method:_avalabs_vm_module_types__WEBPACK_IMPORTED_MODULE_2__.RpcMethod.SOLANA_SIGN_TRANSACTION,params:[{account:t,serializedTx:r}]}})}async signAllTransactions(t,a,r){let c=[];for(let l of r){let j=await this.signTransaction(t,a,l);c.push(j);}return c}signMessage(){throw new Error("signMessage() not implemented.")}signIn(){throw new Error("signIn() not implemented.")}};u=new WeakMap,m=new WeakMap,K=new WeakMap,O=new WeakMap,M=new WeakMap;function nn(o){let e=({register:t})=>t(o);try{window.dispatchEvent(new z(e));}catch(t){console.error(`wallet-standard:register-wallet event could not be dispatched
`,t);}try{window.addEventListener("wallet-standard:app-ready",({detail:t})=>e(t));}catch(t){console.error(`wallet-standard:app-ready event listener could not be added
`,t);}}var S,z=class extends Event{constructor(t){super("wallet-standard:register-wallet",{bubbles:!1,cancelable:!1,composed:!1});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,S,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,S,t);}get detail(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,S)}get type(){return "wallet-standard:register-wallet"}preventDefault(){throw new Error("preventDefault cannot be called")}stopImmediatePropagation(){throw new Error("stopImmediatePropagation cannot be called")}stopPropagation(){throw new Error("stopPropagation cannot be called")}};S=new WeakMap;var tn="solana:mainnet",en="solana:devnet",an="solana:testnet",g=[tn,en,an],pn={[tn]:_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.SolanaCaip2ChainId.MAINNET,[en]:_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.SolanaCaip2ChainId.DEVNET,[an]:_avalabs_core_chains_sdk__WEBPACK_IMPORTED_MODULE_4__.SolanaCaip2ChainId.TESTNET};function P(o){return g.includes(o)}function _(o){return pn[o]}var mn=g,Sn=[_solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_5__.SolanaSignAndSendTransaction,_solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_6__.SolanaSignTransaction],y,w,E,T,A,b,U=class U{constructor({address:e,publicKey:t,label:a,icon:r}){(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,y,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,w,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,E,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,T,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,A,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,b,void 0);new.target===U&&Object.freeze(this),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,y,e),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,w,t),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,E,mn),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,T,Sn),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,A,a),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,b,r);}get address(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,y)}get publicKey(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,w).slice()}get chains(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,E).slice()}get features(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,T).slice()}get label(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,A)}get icon(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,b)}};y=new WeakMap,w=new WeakMap,E=new WeakMap,T=new WeakMap,A=new WeakMap,b=new WeakMap;var L=U;function on(o,e){return yn(o,e)}function yn(o,e){if(o===e)return !0;let t=o.length;if(t!==e.length)return !1;for(let a=0;a<t;a++)if(o[a]!==e[a])return !1;return !0}var vn="connection:",p,V,h,s,k,v,J,F,rn,f,N,R,H,q,W,B,$=class ${constructor(e$1){(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,v);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,F);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,p,{});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,V,"1.0.0");(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,h,void 0);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,s,null);(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,k,(e$1,t)=>((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p)[e$1]??=[],(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p)[e$1]?.push(t),()=>(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,F,rn).call(this,e$1,t)));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,f,()=>{let e$1=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).publicKey?.toBase58();if(e$1){let t=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).publicKey.toBytes(),a=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s);(!a||a.address!==e$1||!on(a.publicKey,t))&&((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,s,new L({address:e$1,publicKey:t})),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,v,J).call(this,"change",{accounts:this.accounts}));}});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,N,()=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s)&&((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,s,null),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.e)(this,v,J).call(this,"change",{accounts:this.accounts}));});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,R,()=>{(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).publicKey?(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f).call(this):(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,N).call(this);});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,H,async({silent:e}={})=>((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s)||await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).connect(e?{onlyIfTrusted:!0}:void 0),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f).call(this),{accounts:this.accounts}));(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,q,async()=>{await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).disconnect();});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,W,async(...e)=>{if(!(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s))throw new Error("not connected");let t=[];if(e.length===1){let{transaction:a,account:r,chain:c,options:l}=e[0],{minContextSlot:j,preflightCommitment:sn,skipPreflight:cn,maxRetries:ln}=l||{};if(r!==(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s))throw new Error("invalid account");if(!P(c))throw new Error("invalid chain");let dn=await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).signAndSendTransaction((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s).address,_(c),_scure_base__WEBPACK_IMPORTED_MODULE_3__.base64.encode(a),{preflightCommitment:sn,minContextSlot:j,maxRetries:ln,skipPreflight:cn});t.push({signature:_scure_base__WEBPACK_IMPORTED_MODULE_3__.base58.decode(dn)});}else if(e.length>1)for(let a of e)t.push(...await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,W).call(this,a));return t});(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.c)(this,B,async(...e)=>{if(!(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s))throw new Error("not connected");let t=[];if(e.length===1){let{transaction:a,account:r,chain:c}=e[0];if(r!==(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s))throw new Error("invalid account");if(c&&!P(c))throw new Error("invalid chain");let l=await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).signTransaction((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s).address,_(c||g[0]),_scure_base__WEBPACK_IMPORTED_MODULE_3__.base64.encode(a));t.push({signedTransaction:_scure_base__WEBPACK_IMPORTED_MODULE_3__.base64.decode(l)});}else if(e.length>1){let a;for(let l of e){if(l.account!==(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s))throw new Error("invalid account");if(l.chain){if(!P(l.chain))throw new Error("invalid chain");if(a){if(l.chain!==a)throw new Error("conflicting chain")}else a=l.chain;}}let r=e.map(({transaction:l})=>_scure_base__WEBPACK_IMPORTED_MODULE_3__.base64.encode(l)),c=await (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).signAllTransactions((0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s).address,_(a||g[0]),r);t.push(...c.map(l=>({signedTransaction:_scure_base__WEBPACK_IMPORTED_MODULE_3__.base64.decode(l)})));}return t});new.target===$&&Object.freeze(this),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.d)(this,h,e$1),e$1.on("connect",(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f),this),e$1.on("disconnect",(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,N),this),e$1.on("accountChanged",(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,R),this),(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,f).call(this);}get version(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,V)}get walletVersion(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).info.version}get name(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).info.name}get icon(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h).info.icon}get chains(){return g.slice()}get features(){return {[_wallet_standard_features__WEBPACK_IMPORTED_MODULE_7__.StandardConnect]:{version:"1.0.0",connect:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,H)},[_wallet_standard_features__WEBPACK_IMPORTED_MODULE_8__.StandardDisconnect]:{version:"1.0.0",disconnect:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,q)},[_wallet_standard_features__WEBPACK_IMPORTED_MODULE_9__.StandardEvents]:{version:"1.0.0",on:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,k)},[_solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_5__.SolanaSignAndSendTransaction]:{version:"1.0.0",supportedTransactionVersions:["legacy",0],signAndSendTransaction:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,W)},[_solana_wallet_standard_features__WEBPACK_IMPORTED_MODULE_6__.SolanaSignTransaction]:{version:"1.0.0",supportedTransactionVersions:["legacy",0],signTransaction:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,B)},[vn]:{connection:(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,h)}}}get accounts(){return (0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s)?[(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,s)]:[]}};p=new WeakMap,V=new WeakMap,h=new WeakMap,s=new WeakMap,k=new WeakMap,v=new WeakSet,J=function(e,...t){(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p)[e]?.forEach(a=>a.apply(null,t));},F=new WeakSet,rn=function(e,t){(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p)[e]=(0,_chunk_7VP42LRT_js__WEBPACK_IMPORTED_MODULE_0__.b)(this,p)[e]?.filter(a=>t!==a);},f=new WeakMap,N=new WeakMap,R=new WeakMap,H=new WeakMap,q=new WeakMap,W=new WeakMap,B=new WeakMap;var D=$;function Yn(o){nn(new D(o));}


//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-6ZLXXGIV.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-6ZLXXGIV.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ t)
/* harmony export */ });
var t=(e=>(e.CORE_WALLET_ANNOUNCE_PROVIDER="core-wallet:announceProvider",e.CORE_WALLET_REQUEST_PROVIDER="core-wallet:requestProvider",e.EIP6963_ANNOUNCE_PROVIDER="eip6963:announceProvider",e.EIP6963_REQUEST_PROVIDER="eip6963:requestProvider",e))(t||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-6ZLXXGIV.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-7JLXTNPE.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-7JLXTNPE.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ A),
/* harmony export */   "b": () => (/* binding */ o),
/* harmony export */   "c": () => (/* binding */ E)
/* harmony export */ });
var A=(r=>(r.BRIDGE="Bridge",r.SWAP="Swap",r.SEND="Send",r.RECEIVE="Receive",r.NFT_BUY="NFTBuy",r.APPROVE="Approve",r.TRANSFER="Transfer",r.NFT_SEND="NFTSend",r.NFT_RECEIVE="NFTReceive",r.AIRDROP="Airdrop",r.FILL_ORDER="FillOrder",r.UNWRAP="Unwrap",r.UNKNOWN="UNKNOWN",r))(A||{}),o=(e=>(e.ADD_VALIDATOR_TX="AddValidatorTx",e.ADD_SUBNET_VALIDATOR_TX="AddSubnetValidatorTx",e.ADD_DELEGATOR_TX="AddDelegatorTx",e.CREATE_CHAIN_TX="CreateChainTx",e.CREATE_SUBNET_TX="CreateSubnetTx",e.IMPORT_TX="ImportTx",e.EXPORT_TX="ExportTx",e.ADVANCE_TIME_TX="AdvanceTimeTx",e.REWARD_VALIDATOR_TX="RewardValidatorTx",e.REMOVE_SUBNET_VALIDATOR_TX="RemoveSubnetValidatorTx",e.TRANSFORM_SUBNET_TX="TransformSubnetTx",e.ADD_PERMISSIONLESS_VALIDATOR_TX="AddPermissionlessValidatorTx",e.ADD_PERMISSIONLESS_DELEGATOR_TX="AddPermissionlessDelegatorTx",e.BASE_TX="BaseTx",e.TRANSFER_SUBNET_OWNERSHIP_TX="TransferSubnetOwnershipTx",e.UNKNOWN="UNKNOWN",e))(o||{}),E=(t=>(t.BASE_TX="BaseTx",t.CREATE_ASSET_TX="CreateAssetTx",t.OPERATION_TX="OperationTx",t.IMPORT_TX="ImportTx",t.EXPORT_TX="ExportTx",t.UNKNOWN="UNKNOWN",t))(E||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-7JLXTNPE.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-7U2R34EQ.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-7U2R34EQ.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-7U2R34EQ.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-BHB5UV3J.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-BHB5UV3J.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-BHB5UV3J.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-E4CYP2GV.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-E4CYP2GV.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ r)
/* harmony export */ });
var r=(e=>(e.Mnemonic="mnemonic",e.Ledger="ledger",e.LedgerLive="ledger-live",e.Keystone="keystone",e.Seedless="seedless",e))(r||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-E4CYP2GV.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-FGMDBV23.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-FGMDBV23.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ e)
/* harmony export */ });
var e=(t=>(t.Base="base",t.AddValidator="add_validator",t.AddDelegator="add_delegator",t.Export="export",t.Import="import",t.CreateSubnet="create_subnet",t.CreateChain="create_chain",t.AddSubnetValidator="add_subnet_validator",t.RemoveSubnetValidator="remove_subnet_validator",t.AddPermissionlessValidator="add_permissionless_validator",t.AddPermissionlessDelegator="add_permissionless_delegator",t.TransformSubnet="transform_subnet",t.TransferSubnetOwnership="transfer_subnet_ownership",t.ConvertSubnetToL1="convert_subnet_to_l1",t.RegisterL1Validator="register_l1_validator",t.SetL1ValidatorWeight="set_l1_validator_weight",t.IncreaseL1ValidatorBalance="increase_l1_validator_balance",t.DisableL1Validator="disable_l1_validator",t.Unknown="unknown",t))(e||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-FGMDBV23.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-FTYN6IZV.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-FTYN6IZV.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ n),
/* harmony export */   "b": () => (/* binding */ i),
/* harmony export */   "c": () => (/* binding */ r)
/* harmony export */ });
var n=(t=>(t.BITCOIN_SEND_TRANSACTION="bitcoin_sendTransaction",t.BITCOIN_SIGN_TRANSACTION="bitcoin_signTransaction",t.ETH_SEND_TRANSACTION="eth_sendTransaction",t.ETH_SEND_TRANSACTION_BATCH="eth_sendTransactionBatch",t.SIGN_TYPED_DATA_V3="eth_signTypedData_v3",t.SIGN_TYPED_DATA_V4="eth_signTypedData_v4",t.SIGN_TYPED_DATA_V1="eth_signTypedData_v1",t.SIGN_TYPED_DATA="eth_signTypedData",t.PERSONAL_SIGN="personal_sign",t.ETH_SIGN="eth_sign",t.AVALANCHE_SIGN_MESSAGE="avalanche_signMessage",t.AVALANCHE_SEND_TRANSACTION="avalanche_sendTransaction",t.AVALANCHE_SIGN_TRANSACTION="avalanche_signTransaction",t.HVM_SIGN_TRANSACTION="hvm_signTransaction",t.SOLANA_SIGN_TRANSACTION="solana_signTransaction",t.SOLANA_SIGN_AND_SEND_TRANSACTION="solana_signAndSendTransaction",t))(n||{}),i=(e=>(e.TEXT="text",e.ADDRESS="address",e.NODE_ID="nodeID",e.CURRENCY="currency",e.FUNDS_RECIPIENT="fundsRecipient",e.DATA="data",e.DATE="date",e.LINK="link",e))(i||{}),r=(a=>(a.WARNING="Warning",a.DANGER="Danger",a.INFO="Info",a))(r||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-FTYN6IZV.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-GF7C4PA6.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-GF7C4PA6.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-GF7C4PA6.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-GMF7R4KJ.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-GMF7R4KJ.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ e)
/* harmony export */ });
var e=(r=>(r.NATIVE="NATIVE",r.ERC20="ERC20",r.ERC721="ERC721",r.ERC1155="ERC1155",r.NONERC="NONERC",r.SPL="SPL",r))(e||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-GMF7R4KJ.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-M2ZWWM4H.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-M2ZWWM4H.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ o),
/* harmony export */   "b": () => (/* binding */ i),
/* harmony export */   "c": () => (/* binding */ n)
/* harmony export */ });
var o=(r=>(r.EVM="EVM",r.BITCOIN="BITCOIN",r.AVM="AVM",r.PVM="PVM",r.CoreEth="CoreEth",r.HVM="HVM",r.SVM="SVM",r))(o||{}),i=(e=>(e.PRODUCTION="production",e.DEV="dev",e))(i||{}),n=(t=>(t.CORE_MOBILE_IOS="core-mobile-ios",t.CORE_MOBILE_ANDROID="core-mobile-android",t.CORE_WEB="core-web",t.CORE_EXTENSION="core-extension",t.EXPLORER="explorer",t.OTHER="other",t))(n||{});


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-M2ZWWM4H.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-P6AM7I3B.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-P6AM7I3B.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-P6AM7I3B.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-REHORWPH.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-REHORWPH.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-REHORWPH.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-RINP3JFP.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-RINP3JFP.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ c)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ "./node_modules/zod/lib/index.mjs");


var n=(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({checksum:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),location:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({npm:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({filePath:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),packageName:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),registry:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)()})})}),o=(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({name:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),version:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),description:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),sources:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({module:n,provider:n.optional()}),network:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({chainIds:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)().array(),namespaces:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)().array()}),cointype:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)(),permissions:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({rpc:(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({dapps:(0,zod__WEBPACK_IMPORTED_MODULE_0__.boolean)(),methods:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)().array(),nonRestrictedMethods:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)().array()})}),manifestVersion:(0,zod__WEBPACK_IMPORTED_MODULE_0__.string)()}),c=r=>o.safeParse(r);


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-RINP3JFP.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/chunk-WOO6UGSQ.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/chunk-WOO6UGSQ.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ c),
/* harmony export */   "b": () => (/* binding */ a)
/* harmony export */ });
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zod */ "./node_modules/zod/lib/index.mjs");


var l=(0,zod__WEBPACK_IMPORTED_MODULE_0__.object)({price:(0,zod__WEBPACK_IMPORTED_MODULE_0__.number)().optional().nullable(),change24:(0,zod__WEBPACK_IMPORTED_MODULE_0__.number)().optional().nullable(),marketCap:(0,zod__WEBPACK_IMPORTED_MODULE_0__.number)().optional().nullable(),vol24:(0,zod__WEBPACK_IMPORTED_MODULE_0__.number)().optional().nullable()}),n=(0,zod__WEBPACK_IMPORTED_MODULE_0__.record)(l),c=(0,zod__WEBPACK_IMPORTED_MODULE_0__.record)(n),a=(0,zod__WEBPACK_IMPORTED_MODULE_0__.record)((0,zod__WEBPACK_IMPORTED_MODULE_0__.record)((0,zod__WEBPACK_IMPORTED_MODULE_0__.number)().nullable().optional()));


//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-WOO6UGSQ.js.map

/***/ }),

/***/ "./node_modules/@avalabs/vm-module-types/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@avalabs/vm-module-types/dist/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlertType": () => (/* reexport safe */ _chunk_FTYN6IZV_js__WEBPACK_IMPORTED_MODULE_2__.c),
/* harmony export */   "AppName": () => (/* reexport safe */ _chunk_M2ZWWM4H_js__WEBPACK_IMPORTED_MODULE_13__.c),
/* harmony export */   "DetailItemType": () => (/* reexport safe */ _chunk_FTYN6IZV_js__WEBPACK_IMPORTED_MODULE_2__.b),
/* harmony export */   "Environment": () => (/* reexport safe */ _chunk_M2ZWWM4H_js__WEBPACK_IMPORTED_MODULE_13__.b),
/* harmony export */   "EventNames": () => (/* reexport safe */ _chunk_6ZLXXGIV_js__WEBPACK_IMPORTED_MODULE_1__.a),
/* harmony export */   "NetworkVMType": () => (/* reexport safe */ _chunk_M2ZWWM4H_js__WEBPACK_IMPORTED_MODULE_13__.a),
/* harmony export */   "PChainTransactionType": () => (/* reexport safe */ _chunk_7JLXTNPE_js__WEBPACK_IMPORTED_MODULE_5__.b),
/* harmony export */   "RawSimplePriceResponseSchema": () => (/* reexport safe */ _chunk_WOO6UGSQ_js__WEBPACK_IMPORTED_MODULE_9__.b),
/* harmony export */   "RpcMethod": () => (/* reexport safe */ _chunk_FTYN6IZV_js__WEBPACK_IMPORTED_MODULE_2__.a),
/* harmony export */   "SimplePriceResponseSchema": () => (/* reexport safe */ _chunk_WOO6UGSQ_js__WEBPACK_IMPORTED_MODULE_9__.a),
/* harmony export */   "TokenType": () => (/* reexport safe */ _chunk_GMF7R4KJ_js__WEBPACK_IMPORTED_MODULE_4__.a),
/* harmony export */   "TransactionType": () => (/* reexport safe */ _chunk_7JLXTNPE_js__WEBPACK_IMPORTED_MODULE_5__.a),
/* harmony export */   "TxType": () => (/* reexport safe */ _chunk_FGMDBV23_js__WEBPACK_IMPORTED_MODULE_3__.a),
/* harmony export */   "WalletType": () => (/* reexport safe */ _chunk_E4CYP2GV_js__WEBPACK_IMPORTED_MODULE_7__.a),
/* harmony export */   "XChainTransactionType": () => (/* reexport safe */ _chunk_7JLXTNPE_js__WEBPACK_IMPORTED_MODULE_5__.c),
/* harmony export */   "parseManifest": () => (/* reexport safe */ _chunk_RINP3JFP_js__WEBPACK_IMPORTED_MODULE_11__.a)
/* harmony export */ });
/* harmony import */ var _chunk_7U2R34EQ_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-7U2R34EQ.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-7U2R34EQ.js");
/* harmony import */ var _chunk_6ZLXXGIV_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chunk-6ZLXXGIV.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-6ZLXXGIV.js");
/* harmony import */ var _chunk_FTYN6IZV_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk-FTYN6IZV.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-FTYN6IZV.js");
/* harmony import */ var _chunk_FGMDBV23_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chunk-FGMDBV23.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-FGMDBV23.js");
/* harmony import */ var _chunk_GMF7R4KJ_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chunk-GMF7R4KJ.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-GMF7R4KJ.js");
/* harmony import */ var _chunk_7JLXTNPE_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chunk-7JLXTNPE.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-7JLXTNPE.js");
/* harmony import */ var _chunk_P6AM7I3B_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chunk-P6AM7I3B.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-P6AM7I3B.js");
/* harmony import */ var _chunk_E4CYP2GV_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./chunk-E4CYP2GV.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-E4CYP2GV.js");
/* harmony import */ var _chunk_BHB5UV3J_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./chunk-BHB5UV3J.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-BHB5UV3J.js");
/* harmony import */ var _chunk_WOO6UGSQ_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chunk-WOO6UGSQ.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-WOO6UGSQ.js");
/* harmony import */ var _chunk_REHORWPH_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./chunk-REHORWPH.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-REHORWPH.js");
/* harmony import */ var _chunk_RINP3JFP_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./chunk-RINP3JFP.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-RINP3JFP.js");
/* harmony import */ var _chunk_GF7C4PA6_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./chunk-GF7C4PA6.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-GF7C4PA6.js");
/* harmony import */ var _chunk_M2ZWWM4H_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./chunk-M2ZWWM4H.js */ "./node_modules/@avalabs/vm-module-types/dist/chunk-M2ZWWM4H.js");














//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@metamask/rpc-errors/dist/chunk-22ZLYCIT.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@metamask/rpc-errors/dist/chunk-22ZLYCIT.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "providerErrors": () => (/* binding */ providerErrors),
/* harmony export */   "rpcErrors": () => (/* binding */ rpcErrors)
/* harmony export */ });
/* harmony import */ var _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-ROLUROML.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-ROLUROML.mjs");
/* harmony import */ var _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chunk-HHE56EX3.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-HHE56EX3.mjs");
/* harmony import */ var _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk-MIW4NMY6.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-MIW4NMY6.mjs");




// src/errors.ts
var rpcErrors = {
  /**
   * Get a JSON RPC 2.0 Parse (-32700) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  parse: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.parse, arg),
  /**
   * Get a JSON RPC 2.0 Invalid Request (-32600) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidRequest: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.invalidRequest, arg),
  /**
   * Get a JSON RPC 2.0 Invalid Params (-32602) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidParams: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.invalidParams, arg),
  /**
   * Get a JSON RPC 2.0 Method Not Found (-32601) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotFound: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.methodNotFound, arg),
  /**
   * Get a JSON RPC 2.0 Internal (-32603) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  internal: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.internal, arg),
  /**
   * Get a JSON RPC 2.0 Server error.
   * Permits integer error codes in the [ -32099 <= -32005 ] range.
   * Codes -32000 through -32004 are reserved by EIP-1474.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  server: (opts) => {
    if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
      throw new Error(
        "Ethereum RPC Server errors must provide single object argument."
      );
    }
    const { code } = opts;
    if (!Number.isInteger(code) || code > -32005 || code < -32099) {
      throw new Error(
        '"code" must be an integer such that: -32099 <= code <= -32005'
      );
    }
    return getJsonRpcError(code, opts);
  },
  /**
   * Get an Ethereum JSON RPC Invalid Input (-32000) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  invalidInput: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.invalidInput, arg),
  /**
   * Get an Ethereum JSON RPC Resource Not Found (-32001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceNotFound: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.resourceNotFound, arg),
  /**
   * Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  resourceUnavailable: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.resourceUnavailable, arg),
  /**
   * Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  transactionRejected: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.transactionRejected, arg),
  /**
   * Get an Ethereum JSON RPC Method Not Supported (-32004) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  methodNotSupported: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.methodNotSupported, arg),
  /**
   * Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link JsonRpcError} class.
   */
  limitExceeded: (arg) => getJsonRpcError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.rpc.limitExceeded, arg)
};
var providerErrors = {
  /**
   * Get an Ethereum Provider User Rejected Request (4001) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  userRejectedRequest: (arg) => {
    return getEthProviderError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.provider.userRejectedRequest, arg);
  },
  /**
   * Get an Ethereum Provider Unauthorized (4100) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unauthorized: (arg) => {
    return getEthProviderError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.provider.unauthorized, arg);
  },
  /**
   * Get an Ethereum Provider Unsupported Method (4200) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  unsupportedMethod: (arg) => {
    return getEthProviderError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.provider.unsupportedMethod, arg);
  },
  /**
   * Get an Ethereum Provider Not Connected (4900) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  disconnected: (arg) => {
    return getEthProviderError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.provider.disconnected, arg);
  },
  /**
   * Get an Ethereum Provider Chain Not Connected (4901) error.
   *
   * @param arg - The error message or options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  chainDisconnected: (arg) => {
    return getEthProviderError(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_2__.errorCodes.provider.chainDisconnected, arg);
  },
  /**
   * Get a custom Ethereum Provider error.
   *
   * @param opts - The error options bag.
   * @returns An instance of the {@link EthereumProviderError} class.
   */
  custom: (opts) => {
    if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
      throw new Error(
        "Ethereum Provider custom errors must provide single object argument."
      );
    }
    const { code, message, data } = opts;
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a nonempty string');
    }
    return new _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_0__.EthereumProviderError(code, message, data);
  }
};
function getJsonRpcError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_0__.JsonRpcError(code, message ?? (0,_chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_1__.getMessageFromCode)(code), data);
}
function getEthProviderError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_0__.EthereumProviderError(
    code,
    message ?? (0,_chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_1__.getMessageFromCode)(code),
    data
  );
}
function parseOpts(arg) {
  if (arg) {
    if (typeof arg === "string") {
      return [arg];
    } else if (typeof arg === "object" && !Array.isArray(arg)) {
      const { message, data } = arg;
      if (message && typeof message !== "string") {
        throw new Error("Must specify string message.");
      }
      return [message ?? void 0, data];
    }
  }
  return [];
}


//# sourceMappingURL=chunk-22ZLYCIT.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/rpc-errors/dist/chunk-HHE56EX3.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@metamask/rpc-errors/dist/chunk-HHE56EX3.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSON_RPC_SERVER_ERROR_MESSAGE": () => (/* binding */ JSON_RPC_SERVER_ERROR_MESSAGE),
/* harmony export */   "dataHasCause": () => (/* binding */ dataHasCause),
/* harmony export */   "getMessageFromCode": () => (/* binding */ getMessageFromCode),
/* harmony export */   "isValidCode": () => (/* binding */ isValidCode),
/* harmony export */   "serializeCause": () => (/* binding */ serializeCause),
/* harmony export */   "serializeError": () => (/* binding */ serializeError)
/* harmony export */ });
/* harmony import */ var _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-MIW4NMY6.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-MIW4NMY6.mjs");
/* harmony import */ var _metamask_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @metamask/utils */ "./node_modules/@metamask/utils/dist/misc.mjs");
/* harmony import */ var _metamask_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @metamask/utils */ "./node_modules/@metamask/utils/dist/json.mjs");


// src/utils.ts

var FALLBACK_ERROR_CODE = _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_0__.errorCodes.rpc.internal;
var FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
var FALLBACK_ERROR = {
  code: FALLBACK_ERROR_CODE,
  message: getMessageFromCode(FALLBACK_ERROR_CODE)
};
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
  if (isValidCode(code)) {
    const codeString = code.toString();
    if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.hasProperty)(_chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_0__.errorValues, codeString)) {
      return _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_0__.errorValues[codeString].message;
    }
    if (isJsonRpcServerError(code)) {
      return JSON_RPC_SERVER_ERROR_MESSAGE;
    }
  }
  return fallbackMessage;
}
function isValidCode(code) {
  return Number.isInteger(code);
}
function serializeError(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = true } = {}) {
  if (!(0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isJsonRpcError)(fallbackError)) {
    throw new Error(
      "Must provide fallback error with integer number code and string message."
    );
  }
  const serialized = buildError(error, fallbackError);
  if (!shouldIncludeStack) {
    delete serialized.stack;
  }
  return serialized;
}
function buildError(error, fallbackError) {
  if (error && typeof error === "object" && "serialize" in error && typeof error.serialize === "function") {
    return error.serialize();
  }
  if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isJsonRpcError)(error)) {
    return error;
  }
  const cause = serializeCause(error);
  const fallbackWithCause = {
    ...fallbackError,
    data: { cause }
  };
  return fallbackWithCause;
}
function isJsonRpcServerError(code) {
  return code >= -32099 && code <= -32e3;
}
function serializeCause(error) {
  if (Array.isArray(error)) {
    return error.map((entry) => {
      if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isValidJson)(entry)) {
        return entry;
      } else if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.isObject)(entry)) {
        return serializeObject(entry);
      }
      return null;
    });
  } else if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.isObject)(error)) {
    return serializeObject(error);
  }
  if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isValidJson)(error)) {
    return error;
  }
  return null;
}
function serializeObject(object) {
  return Object.getOwnPropertyNames(object).reduce(
    (acc, key) => {
      const value = object[key];
      if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isValidJson)(value)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
}
function dataHasCause(data) {
  return (0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.isObject)(data) && (0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.hasProperty)(data, "cause") && (0,_metamask_utils__WEBPACK_IMPORTED_MODULE_1__.isObject)(data.cause);
}


//# sourceMappingURL=chunk-HHE56EX3.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/rpc-errors/dist/chunk-MIW4NMY6.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@metamask/rpc-errors/dist/chunk-MIW4NMY6.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "errorCodes": () => (/* binding */ errorCodes),
/* harmony export */   "errorValues": () => (/* binding */ errorValues)
/* harmony export */ });
// src/error-constants.ts
var errorCodes = {
  rpc: {
    invalidInput: -32e3,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901
  }
};
var errorValues = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available."
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s)."
  },
  "-32603": {
    standard: "JSON RPC 2.0",
    message: "Internal JSON-RPC error."
  },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input."
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found."
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable."
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected."
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported."
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded."
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request."
  },
  "4100": {
    standard: "EIP-1193",
    message: "The requested account and/or method has not been authorized by the user."
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider."
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains."
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain."
  }
};


//# sourceMappingURL=chunk-MIW4NMY6.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/rpc-errors/dist/chunk-ROLUROML.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@metamask/rpc-errors/dist/chunk-ROLUROML.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EthereumProviderError": () => (/* binding */ EthereumProviderError),
/* harmony export */   "JsonRpcError": () => (/* binding */ JsonRpcError)
/* harmony export */ });
/* harmony import */ var _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-HHE56EX3.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-HHE56EX3.mjs");
/* harmony import */ var _metamask_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @metamask/utils */ "./node_modules/@metamask/utils/dist/misc.mjs");
/* harmony import */ var fast_safe_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fast-safe-stringify */ "./node_modules/fast-safe-stringify/index.js");


// src/classes.ts


var JsonRpcError = class extends Error {
  constructor(code, message, data) {
    var __super = (...args) => {
      super(...args);
    };
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a non-empty string.');
    }
    if ((0,_chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_0__.dataHasCause)(data)) {
      __super(message, { cause: data.cause });
      if (!(0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.hasProperty)(this, "cause")) {
        Object.assign(this, { cause: data.cause });
      }
    } else {
      __super(message);
    }
    if (data !== void 0) {
      this.data = data;
    }
    this.code = code;
  }
  /**
   * Get the error as JSON-serializable object.
   *
   * @returns A plain object with all public class properties.
   */
  serialize() {
    const serialized = {
      code: this.code,
      message: this.message
    };
    if (this.data !== void 0) {
      serialized.data = this.data;
      if ((0,_metamask_utils__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(this.data)) {
        serialized.data.cause = (0,_chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_0__.serializeCause)(this.data.cause);
      }
    }
    if (this.stack) {
      serialized.stack = this.stack;
    }
    return serialized;
  }
  /**
   * Get a string representation of the serialized error, omitting any circular
   * references.
   *
   * @returns A string representation of the serialized error.
   */
  toString() {
    return fast_safe_stringify__WEBPACK_IMPORTED_MODULE_1__(this.serialize(), stringifyReplacer, 2);
  }
};
var EthereumProviderError = class extends JsonRpcError {
  /**
   * Create an Ethereum Provider JSON-RPC error.
   *
   * @param code - The JSON-RPC error code. Must be an integer in the
   * `1000 <= n <= 4999` range.
   * @param message - The JSON-RPC error message.
   * @param data - Optional data to include in the error.
   */
  constructor(code, message, data) {
    if (!isValidEthProviderCode(code)) {
      throw new Error(
        '"code" must be an integer such that: 1000 <= code <= 4999'
      );
    }
    super(code, message, data);
  }
};
function isValidEthProviderCode(code) {
  return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
function stringifyReplacer(_, value) {
  if (value === "[Circular]") {
    return void 0;
  }
  return value;
}


//# sourceMappingURL=chunk-ROLUROML.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/rpc-errors/dist/index.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/@metamask/rpc-errors/dist/index.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EthereumProviderError": () => (/* reexport safe */ _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_1__.EthereumProviderError),
/* harmony export */   "JsonRpcError": () => (/* reexport safe */ _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_1__.JsonRpcError),
/* harmony export */   "dataHasCause": () => (/* reexport safe */ _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_2__.dataHasCause),
/* harmony export */   "errorCodes": () => (/* reexport safe */ _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_3__.errorCodes),
/* harmony export */   "getMessageFromCode": () => (/* reexport safe */ _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_2__.getMessageFromCode),
/* harmony export */   "providerErrors": () => (/* reexport safe */ _chunk_22ZLYCIT_mjs__WEBPACK_IMPORTED_MODULE_0__.providerErrors),
/* harmony export */   "rpcErrors": () => (/* reexport safe */ _chunk_22ZLYCIT_mjs__WEBPACK_IMPORTED_MODULE_0__.rpcErrors),
/* harmony export */   "serializeCause": () => (/* reexport safe */ _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_2__.serializeCause),
/* harmony export */   "serializeError": () => (/* reexport safe */ _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_2__.serializeError)
/* harmony export */ });
/* harmony import */ var _chunk_22ZLYCIT_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk-22ZLYCIT.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-22ZLYCIT.mjs");
/* harmony import */ var _chunk_ROLUROML_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chunk-ROLUROML.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-ROLUROML.mjs");
/* harmony import */ var _chunk_HHE56EX3_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chunk-HHE56EX3.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-HHE56EX3.mjs");
/* harmony import */ var _chunk_MIW4NMY6_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chunk-MIW4NMY6.mjs */ "./node_modules/@metamask/rpc-errors/dist/chunk-MIW4NMY6.mjs");





//# sourceMappingURL=index.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/error.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/error.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StructError": () => (/* binding */ StructError)
/* harmony export */ });
/**
 * A `StructFailure` represents a single specific failure in validation.
 */
/**
 * `StructError` objects are thrown (or returned) when validation fails.
 *
 * Validation logic is design to exit early for maximum performance. The error
 * represents the first error encountered during validation. For more detail,
 * the `error.failures` property is a generator function that can be run to
 * continue validation and receive all the failures in the data.
 */
class StructError extends TypeError {
    constructor(failure, failures) {
        let cached;
        const { message, explanation, ...rest } = failure;
        const { path } = failure;
        const cause = path.length === 0 ? message : `At path: ${path.join('.')} -- ${message}`;
        super(explanation ?? cause);
        if (explanation !== null && explanation !== undefined) {
            this.cause = cause;
        }
        Object.assign(this, rest);
        this.name = this.constructor.name;
        this.failures = () => {
            return (cached ?? (cached = [failure, ...failures()]));
        };
    }
}
//# sourceMappingURL=error.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/struct.mjs":
/*!************************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/struct.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Struct": () => (/* binding */ Struct),
/* harmony export */   "assert": () => (/* binding */ assert),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "mask": () => (/* binding */ mask),
/* harmony export */   "validate": () => (/* binding */ validate)
/* harmony export */ });
/* harmony import */ var _error_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.mjs */ "./node_modules/@metamask/superstruct/dist/error.mjs");
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.mjs */ "./node_modules/@metamask/superstruct/dist/utils.mjs");


/**
 * `Struct` objects encapsulate the validation logic for a specific type of
 * values. Once constructed, you use the `assert`, `is` or `validate` helpers to
 * validate unknown input data against the struct.
 */
class Struct {
    constructor(props) {
        const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {
            /* noop */
        }, } = props;
        this.type = type;
        this.schema = schema;
        this.entries = entries;
        this.coercer = coercer;
        if (validator) {
            this.validator = (value, context) => {
                const result = validator(value, context);
                return (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.toFailures)(result, context, this, value);
            };
        }
        else {
            this.validator = () => [];
        }
        if (refiner) {
            this.refiner = (value, context) => {
                const result = refiner(value, context);
                return (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.toFailures)(result, context, this, value);
            };
        }
        else {
            this.refiner = () => [];
        }
    }
    /**
     * Assert that a value passes the struct's validation, throwing if it doesn't.
     */
    assert(value, message) {
        return assert(value, this, message);
    }
    /**
     * Create a value with the struct's coercion logic, then validate it.
     */
    create(value, message) {
        return create(value, this, message);
    }
    /**
     * Check if a value passes the struct's validation.
     */
    is(value) {
        return is(value, this);
    }
    /**
     * Mask a value, coercing and validating it, but returning only the subset of
     * properties defined by the struct's schema.
     */
    mask(value, message) {
        return mask(value, this, message);
    }
    /**
     * Validate a value with the struct's validation logic, returning a tuple
     * representing the result.
     *
     * You may optionally pass `true` for the `withCoercion` argument to coerce
     * the value before attempting to validate it. If you do, the result will
     * contain the coerced result when successful.
     */
    validate(value, options = {}) {
        return validate(value, this, options);
    }
}
/**
 * Assert that a value passes a struct, throwing if it doesn't.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param message - An optional message to include in the error.
 */
function assert(value, struct, message) {
    const result = validate(value, struct, { message });
    if (result[0]) {
        throw result[0];
    }
}
/**
 * Create a value with the coercion logic of struct and validate it.
 *
 * @param value - The value to coerce and validate.
 * @param struct - The struct to validate against.
 * @param message - An optional message to include in the error.
 * @returns The coerced and validated value.
 */
function create(value, struct, message) {
    const result = validate(value, struct, { coerce: true, message });
    if (result[0]) {
        throw result[0];
    }
    else {
        return result[1];
    }
}
/**
 * Mask a value, returning only the subset of properties defined by a struct.
 *
 * @param value - The value to mask.
 * @param struct - The struct to mask against.
 * @param message - An optional message to include in the error.
 * @returns The masked value.
 */
function mask(value, struct, message) {
    const result = validate(value, struct, { coerce: true, mask: true, message });
    if (result[0]) {
        throw result[0];
    }
    else {
        return result[1];
    }
}
/**
 * Check if a value passes a struct.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @returns `true` if the value passes the struct, `false` otherwise.
 */
function is(value, struct) {
    const result = validate(value, struct);
    return !result[0];
}
/**
 * Validate a value against a struct, returning an error if invalid, or the
 * value (with potential coercion) if valid.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param options - Optional settings.
 * @param options.coerce - Whether to coerce the value before validating it.
 * @param options.mask - Whether to mask the value before validating it.
 * @param options.message - An optional message to include in the error.
 * @returns A tuple containing the error (if invalid) and the validated value.
 */
function validate(value, struct, options = {}) {
    const tuples = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.run)(value, struct, options);
    const tuple = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_0__.shiftIterator)(tuples);
    if (tuple[0]) {
        const error = new _error_mjs__WEBPACK_IMPORTED_MODULE_1__.StructError(tuple[0], function* () {
            for (const innerTuple of tuples) {
                if (innerTuple[0]) {
                    yield innerTuple[0];
                }
            }
        });
        return [error, undefined];
    }
    const validatedValue = tuple[1];
    return [undefined, validatedValue];
}
//# sourceMappingURL=struct.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/structs/coercions.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/structs/coercions.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "coerce": () => (/* binding */ coerce),
/* harmony export */   "defaulted": () => (/* binding */ defaulted),
/* harmony export */   "trimmed": () => (/* binding */ trimmed)
/* harmony export */ });
/* harmony import */ var _struct_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../struct.mjs */ "./node_modules/@metamask/superstruct/dist/struct.mjs");
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.mjs */ "./node_modules/@metamask/superstruct/dist/utils.mjs");
/* harmony import */ var _types_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.mjs */ "./node_modules/@metamask/superstruct/dist/structs/types.mjs");



/**
 * Augment a `Struct` to add an additional coercion step to its input.
 *
 * This allows you to transform input data before validating it, to increase the
 * likelihood that it passes validation—for example for default values, parsing
 * different formats, etc.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @param condition - A struct that the input must pass to be coerced.
 * @param coercer - A function that takes the input and returns the coerced
 * value.
 * @returns A new struct that will coerce its input before validating it.
 */
function coerce(struct, condition, coercer) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_0__.Struct({
        ...struct,
        coercer: (value, ctx) => {
            return (0,_struct_mjs__WEBPACK_IMPORTED_MODULE_0__.is)(value, condition)
                ? struct.coercer(coercer(value, ctx), ctx)
                : struct.coercer(value, ctx);
        },
    });
}
/**
 * Augment a struct to replace `undefined` values with a default.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @param fallback - The value to use when the input is `undefined`.
 * @param options - An optional options object.
 * @param options.strict - When `true`, the fallback will only be used when the
 * input is `undefined`. When `false`, the fallback will be used when the input
 * is `undefined` or when the input is a plain object and the fallback is a
 * plain object, and any keys in the fallback are missing from the input.
 * @returns A new struct that will replace `undefined` inputs with a default.
 */
function defaulted(struct, fallback, options = {}) {
    return coerce(struct, (0,_types_mjs__WEBPACK_IMPORTED_MODULE_1__.unknown)(), (value) => {
        const result = typeof fallback === 'function' ? fallback() : fallback;
        if (value === undefined) {
            return result;
        }
        if (!options.strict && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(value) && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(result)) {
            const ret = { ...value };
            let changed = false;
            for (const key in result) {
                if (ret[key] === undefined) {
                    ret[key] = result[key];
                    changed = true;
                }
            }
            if (changed) {
                return ret;
            }
        }
        return value;
    });
}
/**
 * Augment a struct to trim string inputs.
 *
 * Note: You must use `create(value, Struct)` on the value to have the coercion
 * take effect! Using simply `assert()` or `is()` will not use coercion.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will trim string inputs before validating them.
 */
function trimmed(struct) {
    return coerce(struct, (0,_types_mjs__WEBPACK_IMPORTED_MODULE_1__.string)(), (value) => value.trim());
}
//# sourceMappingURL=coercions.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/structs/types.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/structs/types.mjs ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "any": () => (/* binding */ any),
/* harmony export */   "array": () => (/* binding */ array),
/* harmony export */   "bigint": () => (/* binding */ bigint),
/* harmony export */   "boolean": () => (/* binding */ boolean),
/* harmony export */   "date": () => (/* binding */ date),
/* harmony export */   "enums": () => (/* binding */ enums),
/* harmony export */   "func": () => (/* binding */ func),
/* harmony export */   "instance": () => (/* binding */ instance),
/* harmony export */   "integer": () => (/* binding */ integer),
/* harmony export */   "intersection": () => (/* binding */ intersection),
/* harmony export */   "literal": () => (/* binding */ literal),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "never": () => (/* binding */ never),
/* harmony export */   "nullable": () => (/* binding */ nullable),
/* harmony export */   "number": () => (/* binding */ number),
/* harmony export */   "object": () => (/* binding */ object),
/* harmony export */   "optional": () => (/* binding */ optional),
/* harmony export */   "record": () => (/* binding */ record),
/* harmony export */   "regexp": () => (/* binding */ regexp),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "string": () => (/* binding */ string),
/* harmony export */   "tuple": () => (/* binding */ tuple),
/* harmony export */   "type": () => (/* binding */ type),
/* harmony export */   "union": () => (/* binding */ union),
/* harmony export */   "unknown": () => (/* binding */ unknown)
/* harmony export */ });
/* harmony import */ var _struct_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../struct.mjs */ "./node_modules/@metamask/superstruct/dist/struct.mjs");
/* harmony import */ var _utils_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.mjs */ "./node_modules/@metamask/superstruct/dist/utils.mjs");
/* harmony import */ var _utilities_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utilities.mjs */ "./node_modules/@metamask/superstruct/dist/structs/utilities.mjs");



/**
 * Ensure that any value passes validation.
 *
 * @returns A struct that will always pass validation.
 */
function any() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('any', () => true);
}
/**
 * Ensure that a value is an array and that its elements are of a specific type.
 *
 * Note: If you omit the element struct, the arrays elements will not be
 * iterated at all. This can be helpful for cases where performance is critical,
 * and it is preferred to using `array(any())`.
 *
 * @param Element - The struct to validate each element in the array against.
 * @returns A new struct that will only accept arrays of the given type.
 */
function array(Element) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'array',
        schema: Element,
        *entries(value) {
            if (Element && Array.isArray(value)) {
                for (const [index, arrayValue] of value.entries()) {
                    yield [index, arrayValue, Element];
                }
            }
        },
        coercer(value) {
            return Array.isArray(value) ? value.slice() : value;
        },
        validator(value) {
            return (Array.isArray(value) ||
                `Expected an array value, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value is a bigint.
 *
 * @returns A new struct that will only accept bigints.
 */
function bigint() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('bigint', (value) => {
        return typeof value === 'bigint';
    });
}
/**
 * Ensure that a value is a boolean.
 *
 * @returns A new struct that will only accept booleans.
 */
function boolean() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('boolean', (value) => {
        return typeof value === 'boolean';
    });
}
/**
 * Ensure that a value is a valid `Date`.
 *
 * Note: this also ensures that the value is *not* an invalid `Date` object,
 * which can occur when parsing a date fails but still returns a `Date`.
 *
 * @returns A new struct that will only accept valid `Date` objects.
 */
function date() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('date', (value) => {
        return ((value instanceof Date && !isNaN(value.getTime())) ||
            `Expected a valid \`Date\` object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value is one of a set of potential values.
 *
 * Note: after creating the struct, you can access the definition of the
 * potential values as `struct.schema`.
 *
 * @param values - The potential values that the input can be.
 * @returns A new struct that will only accept the given values.
 */
function enums(values) {
    const schema = {};
    const description = values.map((value) => (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)).join();
    for (const key of values) {
        schema[key] = key;
    }
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'enums',
        schema,
        validator(value) {
            return (values.includes(value) ||
                `Expected one of \`${description}\`, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value is a function.
 *
 * @returns A new struct that will only accept functions.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function func() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('func', (value) => {
        return (typeof value === 'function' ||
            `Expected a function, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value is an instance of a specific class.
 *
 * @param Class - The class that the value must be an instance of.
 * @returns A new struct that will only accept instances of the given class.
 */
function instance(Class) {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('instance', (value) => {
        return (value instanceof Class ||
            `Expected a \`${Class.name}\` instance, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value is an integer.
 *
 * @returns A new struct that will only accept integers.
 */
function integer() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('integer', (value) => {
        return ((typeof value === 'number' && !isNaN(value) && Number.isInteger(value)) ||
            `Expected an integer, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value matches all of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match all of the
 * given structs.
 */
function intersection(Structs) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'intersection',
        schema: null,
        *entries(value, context) {
            for (const { entries } of Structs) {
                yield* entries(value, context);
            }
        },
        *validator(value, context) {
            for (const { validator } of Structs) {
                yield* validator(value, context);
            }
        },
        *refiner(value, context) {
            for (const { refiner } of Structs) {
                yield* refiner(value, context);
            }
        },
    });
}
/**
 * Ensure that a value is an exact value, using `===` for comparison.
 *
 * @param constant - The exact value that the input must be.
 * @returns A new struct that will only accept the exact given value.
 */
function literal(constant) {
    const description = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(constant);
    const valueType = typeof constant;
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'literal',
        schema: valueType === 'string' ||
            valueType === 'number' ||
            valueType === 'boolean'
            ? constant
            : null,
        validator(value) {
            return (value === constant ||
                `Expected the literal \`${description}\`, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value is a `Map` object, and that its keys and values are of
 * specific types.
 *
 * @param Key - The struct to validate each key in the map against.
 * @param Value - The struct to validate each value in the map against.
 * @returns A new struct that will only accept `Map` objects.
 */
function map(Key, Value) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'map',
        schema: null,
        *entries(value) {
            if (Key && Value && value instanceof Map) {
                for (const [mapKey, mapValue] of value.entries()) {
                    yield [mapKey, mapKey, Key];
                    yield [mapKey, mapValue, Value];
                }
            }
        },
        coercer(value) {
            return value instanceof Map ? new Map(value) : value;
        },
        validator(value) {
            return (value instanceof Map ||
                `Expected a \`Map\` object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that no value ever passes validation.
 *
 * @returns A new struct that will never pass validation.
 */
function never() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('never', () => false);
}
/**
 * Augment an existing struct to allow `null` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `null` values.
 */
function nullable(struct) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        ...struct,
        validator: (value, ctx) => value === null || struct.validator(value, ctx),
        refiner: (value, ctx) => value === null || struct.refiner(value, ctx),
    });
}
/**
 * Ensure that a value is a number.
 *
 * @returns A new struct that will only accept numbers.
 */
function number() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('number', (value) => {
        return ((typeof value === 'number' && !isNaN(value)) ||
            `Expected a number, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value is an object, that it has a known set of properties,
 * and that its properties are of specific types.
 *
 * Note: Unrecognized properties will fail validation.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
function object(schema) {
    const knowns = schema ? Object.keys(schema) : [];
    const Never = never();
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'object',
        schema: schema ?? null,
        *entries(value) {
            if (schema && (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value)) {
                const unknowns = new Set(Object.keys(value));
                for (const key of knowns) {
                    unknowns.delete(key);
                    yield [key, value[key], schema[key]];
                }
                for (const key of unknowns) {
                    yield [key, value[key], Never];
                }
            }
        },
        validator(value) {
            return ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) || `Expected an object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
        coercer(value) {
            return (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) ? { ...value } : value;
        },
    });
}
/**
 * Augment a struct to allow `undefined` values.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept `undefined` values.
 */
function optional(struct) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        ...struct,
        validator: (value, ctx) => value === undefined || struct.validator(value, ctx),
        refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
    });
}
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * Like TypeScript's `Record` utility.
 */
/**
 * Ensure that a value is an object with keys and values of specific types, but
 * without ensuring any specific shape of properties.
 *
 * @param Key - The struct to validate each key in the record against.
 * @param Value - The struct to validate each value in the record against.
 * @returns A new struct that will only accept objects.
 */
function record(Key, Value) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'record',
        schema: null,
        *entries(value) {
            if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value)) {
                // eslint-disable-next-line guard-for-in
                for (const objectKey in value) {
                    const objectValue = value[objectKey];
                    yield [objectKey, objectKey, Key];
                    yield [objectKey, objectValue, Value];
                }
            }
        },
        validator(value) {
            return ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) || `Expected an object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value is a `RegExp`.
 *
 * Note: this does not test the value against the regular expression! For that
 * you need to use the `pattern()` refinement.
 *
 * @returns A new struct that will only accept `RegExp` objects.
 */
function regexp() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('regexp', (value) => {
        return value instanceof RegExp;
    });
}
/**
 * Ensure that a value is a `Set` object, and that its elements are of a
 * specific type.
 *
 * @param Element - The struct to validate each element in the set against.
 * @returns A new struct that will only accept `Set` objects.
 */
function set(Element) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'set',
        schema: null,
        *entries(value) {
            if (Element && value instanceof Set) {
                for (const setValue of value) {
                    yield [setValue, setValue, Element];
                }
            }
        },
        coercer(value) {
            return value instanceof Set ? new Set(value) : value;
        },
        validator(value) {
            return (value instanceof Set ||
                `Expected a \`Set\` object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value is a string.
 *
 * @returns A new struct that will only accept strings.
 */
function string() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('string', (value) => {
        return (typeof value === 'string' ||
            `Expected a string, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
    });
}
/**
 * Ensure that a value is a tuple of a specific length, and that each of its
 * elements is of a specific type.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept tuples of the given types.
 */
function tuple(Structs) {
    const Never = never();
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'tuple',
        schema: null,
        *entries(value) {
            if (Array.isArray(value)) {
                const length = Math.max(Structs.length, value.length);
                for (let i = 0; i < length; i++) {
                    yield [i, value[i], Structs[i] || Never];
                }
            }
        },
        validator(value) {
            return (Array.isArray(value) ||
                `Expected an array, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
    });
}
/**
 * Ensure that a value has a set of known properties of specific types.
 *
 * Note: Unrecognized properties are allowed and untouched. This is similar to
 * how TypeScript's structural typing works.
 *
 * @param schema - An object that defines the structure of the object.
 * @returns A new struct that will only accept objects.
 */
function type(schema) {
    const keys = Object.keys(schema);
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'type',
        schema,
        *entries(value) {
            if ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value)) {
                for (const k of keys) {
                    yield [k, value[k], schema[k]];
                }
            }
        },
        validator(value) {
            return ((0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) || `Expected an object, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`);
        },
        coercer(value) {
            return (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) ? { ...value } : value;
        },
    });
}
/**
 * Ensure that a value matches one of a set of types.
 *
 * @param Structs - The set of structs that the value must match.
 * @returns A new struct that will only accept values that match one of the
 * given structs.
 */
function union(Structs) {
    const description = Structs.map((struct) => struct.type).join(' | ');
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'union',
        schema: null,
        coercer(value) {
            for (const InnerStruct of Structs) {
                const [error, coerced] = InnerStruct.validate(value, { coerce: true });
                if (!error) {
                    return coerced;
                }
            }
            return value;
        },
        validator(value, ctx) {
            const failures = [];
            for (const InnerStruct of Structs) {
                const [...tuples] = (0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.run)(value, InnerStruct, ctx);
                const [first] = tuples;
                if (!first?.[0]) {
                    return [];
                }
                for (const [failure] of tuples) {
                    if (failure) {
                        failures.push(failure);
                    }
                }
            }
            return [
                `Expected the value to satisfy a union of \`${description}\`, but received: ${(0,_utils_mjs__WEBPACK_IMPORTED_MODULE_2__.print)(value)}`,
                ...failures,
            ];
        },
    });
}
/**
 * Ensure that any value passes validation, without widening its type to `any`.
 *
 * @returns A struct that will always pass validation.
 */
function unknown() {
    return (0,_utilities_mjs__WEBPACK_IMPORTED_MODULE_0__.define)('unknown', () => true);
}
//# sourceMappingURL=types.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/structs/utilities.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/structs/utilities.mjs ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assign": () => (/* binding */ assign),
/* harmony export */   "define": () => (/* binding */ define),
/* harmony export */   "deprecated": () => (/* binding */ deprecated),
/* harmony export */   "dynamic": () => (/* binding */ dynamic),
/* harmony export */   "lazy": () => (/* binding */ lazy),
/* harmony export */   "omit": () => (/* binding */ omit),
/* harmony export */   "partial": () => (/* binding */ partial),
/* harmony export */   "pick": () => (/* binding */ pick)
/* harmony export */ });
/* harmony import */ var _struct_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../struct.mjs */ "./node_modules/@metamask/superstruct/dist/struct.mjs");
/* harmony import */ var _types_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.mjs */ "./node_modules/@metamask/superstruct/dist/structs/types.mjs");


/**
 * Create a new struct that combines the properties from multiple object or type
 * structs. Its return type will match the first parameter's type.
 *
 * @param Structs - The structs to combine.
 * @returns A new struct that combines the properties of the input structs.
 */
function assign(...Structs) {
    const isType = Structs[0]?.type === 'type';
    const schemas = Structs.map(({ schema }) => schema);
    const schema = Object.assign({}, ...schemas);
    return isType ? (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.type)(schema) : (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.object)(schema);
}
/**
 * Define a new struct type with a custom validation function.
 *
 * @param name - The name of the struct type.
 * @param validator - The validation function.
 * @returns A new struct type.
 */
function define(name, validator) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({ type: name, schema: null, validator });
}
/**
 * Create a new struct based on an existing struct, but the value is allowed to
 * be `undefined`. `log` will be called if the value is not `undefined`.
 *
 * @param struct - The struct to augment.
 * @param log - The function to call when the value is not `undefined`.
 * @returns A new struct that will only accept `undefined` or values that pass
 * the input struct.
 */
function deprecated(struct, log) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        ...struct,
        refiner: (value, ctx) => value === undefined || struct.refiner(value, ctx),
        validator(value, ctx) {
            if (value === undefined) {
                return true;
            }
            log(value, ctx);
            return struct.validator(value, ctx);
        },
    });
}
/**
 * Create a struct with dynamic validation logic.
 *
 * The callback will receive the value currently being validated, and must
 * return a struct object to validate it with. This can be useful to model
 * validation logic that changes based on its input.
 *
 * @param fn - The callback to create the struct.
 * @returns A new struct with dynamic validation logic.
 */
function dynamic(fn) {
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'dynamic',
        schema: null,
        *entries(value, ctx) {
            const struct = fn(value, ctx);
            yield* struct.entries(value, ctx);
        },
        validator(value, ctx) {
            const struct = fn(value, ctx);
            return struct.validator(value, ctx);
        },
        coercer(value, ctx) {
            const struct = fn(value, ctx);
            return struct.coercer(value, ctx);
        },
        refiner(value, ctx) {
            const struct = fn(value, ctx);
            return struct.refiner(value, ctx);
        },
    });
}
/**
 * Create a struct with lazily evaluated validation logic.
 *
 * The first time validation is run with the struct, the callback will be called
 * and must return a struct object to use. This is useful for cases where you
 * want to have self-referential structs for nested data structures to avoid a
 * circular definition problem.
 *
 * @param fn - The callback to create the struct.
 * @returns A new struct with lazily evaluated validation logic.
 */
function lazy(fn) {
    let struct;
    return new _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct({
        type: 'lazy',
        schema: null,
        *entries(value, ctx) {
            struct ?? (struct = fn());
            yield* struct.entries(value, ctx);
        },
        validator(value, ctx) {
            struct ?? (struct = fn());
            return struct.validator(value, ctx);
        },
        coercer(value, ctx) {
            struct ?? (struct = fn());
            return struct.coercer(value, ctx);
        },
        refiner(value, ctx) {
            struct ?? (struct = fn());
            return struct.refiner(value, ctx);
        },
    });
}
/**
 * Create a new struct based on an existing object struct, but excluding
 * specific properties.
 *
 * Like TypeScript's `Omit` utility.
 *
 * @param struct - The struct to augment.
 * @param keys - The keys to omit.
 * @returns A new struct that will not accept the input keys.
 */
function omit(struct, keys) {
    const { schema } = struct;
    const subschema = { ...schema };
    for (const key of keys) {
        delete subschema[key];
    }
    switch (struct.type) {
        case 'type':
            return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.type)(subschema);
        default:
            return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.object)(subschema);
    }
}
/**
 * Create a new struct based on an existing object struct, but with all of its
 * properties allowed to be `undefined`.
 *
 * Like TypeScript's `Partial` utility.
 *
 * @param struct - The struct to augment.
 * @returns A new struct that will accept the input keys as `undefined`.
 */
function partial(struct) {
    const isStruct = struct instanceof _struct_mjs__WEBPACK_IMPORTED_MODULE_1__.Struct;
    const schema = isStruct ? { ...struct.schema } : { ...struct };
    // eslint-disable-next-line guard-for-in
    for (const key in schema) {
        schema[key] = (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.optional)(schema[key]);
    }
    if (isStruct && struct.type === 'type') {
        return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.type)(schema);
    }
    return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.object)(schema);
}
/**
 * Create a new struct based on an existing object struct, but only including
 * specific properties.
 *
 * Like TypeScript's `Pick` utility.
 *
 * @param struct - The struct to augment.
 * @param keys - The keys to pick.
 * @returns A new struct that will only accept the input keys.
 */
function pick(struct, keys) {
    const { schema } = struct;
    const subschema = {};
    for (const key of keys) {
        subschema[key] = schema[key];
    }
    switch (struct.type) {
        case 'type':
            return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.type)(subschema);
        default:
            return (0,_types_mjs__WEBPACK_IMPORTED_MODULE_0__.object)(subschema);
    }
}
//# sourceMappingURL=utilities.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/superstruct/dist/utils.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/@metamask/superstruct/dist/utils.mjs ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject),
/* harmony export */   "print": () => (/* binding */ print),
/* harmony export */   "run": () => (/* binding */ run),
/* harmony export */   "shiftIterator": () => (/* binding */ shiftIterator),
/* harmony export */   "toFailure": () => (/* binding */ toFailure),
/* harmony export */   "toFailures": () => (/* binding */ toFailures)
/* harmony export */ });
/**
 * Check if a value is an iterator.
 *
 * @param value - The value to check.
 * @returns Whether the value is an iterator.
 */
function isIterable(value) {
    return isObject(value) && typeof value[Symbol.iterator] === 'function';
}
/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
/**
 * Check if a value is a plain object.
 *
 * @param value - The value to check.
 * @returns Whether the value is a plain object.
 */
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}
/**
 * Return a value as a printable string.
 *
 * @param value - The value to print.
 * @returns The value as a string.
 */
function print(value) {
    if (typeof value === 'symbol') {
        return value.toString();
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return typeof value === 'string' ? JSON.stringify(value) : `${value}`;
}
/**
 * Shift (remove and return) the first value from the `input` iterator.
 * Like `Array.prototype.shift()` but for an `Iterator`.
 *
 * @param input - The iterator to shift.
 * @returns The first value of the iterator, or `undefined` if the iterator is
 * empty.
 */
function shiftIterator(input) {
    const { done, value } = input.next();
    return done ? undefined : value;
}
/**
 * Convert a single validation result to a failure.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @returns A failure if the result is a failure, or `undefined` if the result
 * is a success.
 */
function toFailure(result, context, struct, value) {
    if (result === true) {
        return undefined;
    }
    else if (result === false) {
        // eslint-disable-next-line no-param-reassign
        result = {};
    }
    else if (typeof result === 'string') {
        // eslint-disable-next-line no-param-reassign
        result = { message: result };
    }
    const { path, branch } = context;
    const { type } = struct;
    const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ''}, but received: \`${print(value)}\``, } = result;
    return {
        value,
        type,
        refinement,
        key: path[path.length - 1],
        path,
        branch,
        ...result,
        message,
    };
}
/**
 * Convert a validation result to an iterable of failures.
 *
 * @param result - The result to convert.
 * @param context - The context of the validation.
 * @param struct - The struct being validated.
 * @param value - The value being validated.
 * @yields The failures.
 * @returns An iterable of failures.
 */
function* toFailures(result, context, struct, value) {
    if (!isIterable(result)) {
        // eslint-disable-next-line no-param-reassign
        result = [result];
    }
    for (const validationResult of result) {
        const failure = toFailure(validationResult, context, struct, value);
        if (failure) {
            yield failure;
        }
    }
}
/**
 * Check a value against a struct, traversing deeply into nested values, and
 * returning an iterator of failures or success.
 *
 * @param value - The value to check.
 * @param struct - The struct to check against.
 * @param options - Optional settings.
 * @param options.path - The path to the value in the input data.
 * @param options.branch - The branch of the value in the input data.
 * @param options.coerce - Whether to coerce the value before validating it.
 * @param options.mask - Whether to mask the value before validating it.
 * @param options.message - An optional message to include in the error.
 * @yields An iterator of failures or success.
 * @returns An iterator of failures or success.
 */
function* run(value, struct, options = {}) {
    const { path = [], branch = [value], coerce = false, mask = false } = options;
    const context = { path, branch };
    if (coerce) {
        // eslint-disable-next-line no-param-reassign
        value = struct.coercer(value, context);
        if (mask &&
            struct.type !== 'type' &&
            isObject(struct.schema) &&
            isObject(value) &&
            !Array.isArray(value)) {
            for (const key in value) {
                if (struct.schema[key] === undefined) {
                    delete value[key];
                }
            }
        }
    }
    let status = 'valid';
    for (const failure of struct.validator(value, context)) {
        failure.explanation = options.message;
        status = 'not_valid';
        yield [failure, undefined];
    }
    // eslint-disable-next-line prefer-const
    for (let [innerKey, innerValue, innerStruct] of struct.entries(value, context)) {
        const iterable = run(innerValue, innerStruct, {
            path: innerKey === undefined ? path : [...path, innerKey],
            branch: innerKey === undefined ? branch : [...branch, innerValue],
            coerce,
            mask,
            message: options.message,
        });
        for (const result of iterable) {
            if (result[0]) {
                status =
                    result[0].refinement === null || result[0].refinement === undefined
                        ? 'not_valid'
                        : 'not_refined';
                yield [result[0], undefined];
            }
            else if (coerce) {
                innerValue = result[1];
                if (innerKey === undefined) {
                    // eslint-disable-next-line no-param-reassign
                    value = innerValue;
                }
                else if (value instanceof Map) {
                    value.set(innerKey, innerValue);
                }
                else if (value instanceof Set) {
                    value.add(innerValue);
                }
                else if (isObject(value)) {
                    if (innerValue !== undefined || innerKey in value) {
                        value[innerKey] = innerValue;
                    }
                }
            }
        }
    }
    if (status !== 'not_valid') {
        for (const failure of struct.refiner(value, context)) {
            failure.explanation = options.message;
            status = 'not_refined';
            yield [failure, undefined];
        }
    }
    if (status === 'valid') {
        yield [undefined, value];
    }
}
//# sourceMappingURL=utils.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/utils/dist/assert.mjs":
/*!******************************************************!*\
  !*** ./node_modules/@metamask/utils/dist/assert.mjs ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AssertionError": () => (/* binding */ AssertionError),
/* harmony export */   "assert": () => (/* binding */ assert),
/* harmony export */   "assertExhaustive": () => (/* binding */ assertExhaustive),
/* harmony export */   "assertStruct": () => (/* binding */ assertStruct)
/* harmony export */ });
/* harmony import */ var _metamask_superstruct__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @metamask/superstruct */ "./node_modules/@metamask/superstruct/dist/struct.mjs");
/* harmony import */ var _errors_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors.mjs */ "./node_modules/@metamask/utils/dist/errors.mjs");


/**
 * Check if a value is a constructor, i.e., a function that can be called with
 * the `new` keyword.
 *
 * @param fn - The value to check.
 * @returns `true` if the value is a constructor, or `false` otherwise.
 */
function isConstructable(fn) {
    /* istanbul ignore next */
    return Boolean(typeof fn?.prototype?.constructor?.name === 'string');
}
/**
 * Attempts to obtain the message from a possible error object. If it is
 * possible to do so, any trailing period will be removed from the message;
 * otherwise an empty string is returned.
 *
 * @param error - The error object to get the message from.
 * @returns The message without any trailing period if `error` is an object
 * with a `message` property; the string version of `error` without any trailing
 * period if it is not `undefined` or `null`; otherwise an empty string.
 */
function getErrorMessageWithoutTrailingPeriod(error) {
    // We'll add our own period.
    return (0,_errors_mjs__WEBPACK_IMPORTED_MODULE_0__.getErrorMessage)(error).replace(/\.$/u, '');
}
/**
 * Initialise an {@link AssertionErrorConstructor} error.
 *
 * @param ErrorWrapper - The error class to use.
 * @param message - The error message.
 * @returns The error object.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getError(ErrorWrapper, message) {
    if (isConstructable(ErrorWrapper)) {
        return new ErrorWrapper({
            message,
        });
    }
    return ErrorWrapper({
        message,
    });
}
/**
 * The default error class that is thrown if an assertion fails.
 */
class AssertionError extends Error {
    constructor(options) {
        super(options.message);
        this.code = 'ERR_ASSERTION';
    }
}
/**
 * Same as Node.js assert.
 * If the value is falsy, throws an error, does nothing otherwise.
 *
 * @throws {@link AssertionError} If value is falsy.
 * @param value - The test that should be truthy to pass.
 * @param message - Message to be passed to {@link AssertionError} or an
 * {@link Error} instance to throw.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}. If a custom error class is provided for
 * the `message` argument, this argument is ignored.
 */
function assert(value, message = 'Assertion failed.', 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper = AssertionError) {
    if (!value) {
        if (message instanceof Error) {
            throw message;
        }
        throw getError(ErrorWrapper, message);
    }
}
/**
 * Assert a value against a Superstruct struct.
 *
 * @param value - The value to validate.
 * @param struct - The struct to validate against.
 * @param errorPrefix - A prefix to add to the error message. Defaults to
 * "Assertion failed".
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the value is not valid.
 */
function assertStruct(value, struct, errorPrefix = 'Assertion failed', 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper = AssertionError) {
    try {
        (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_1__.assert)(value, struct);
    }
    catch (error) {
        throw getError(ErrorWrapper, `${errorPrefix}: ${getErrorMessageWithoutTrailingPeriod(error)}.`);
    }
}
/**
 * Use in the default case of a switch that you want to be fully exhaustive.
 * Using this function forces the compiler to enforce exhaustivity during
 * compile-time.
 *
 * @example
 * ```
 * const number = 1;
 * switch (number) {
 *   case 0:
 *     ...
 *   case 1:
 *     ...
 *   default:
 *     assertExhaustive(snapPrefix);
 * }
 * ```
 * @param _object - The object on which the switch is being operated.
 */
function assertExhaustive(_object) {
    throw new Error('Invalid branch reached. Should be detected during compilation.');
}
//# sourceMappingURL=assert.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/utils/dist/errors.mjs":
/*!******************************************************!*\
  !*** ./node_modules/@metamask/utils/dist/errors.mjs ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getErrorMessage": () => (/* binding */ getErrorMessage),
/* harmony export */   "isErrorWithCode": () => (/* binding */ isErrorWithCode),
/* harmony export */   "isErrorWithMessage": () => (/* binding */ isErrorWithMessage),
/* harmony export */   "isErrorWithStack": () => (/* binding */ isErrorWithStack),
/* harmony export */   "wrapError": () => (/* binding */ wrapError)
/* harmony export */ });
/* harmony import */ var pony_cause__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pony-cause */ "./node_modules/pony-cause/index.mjs");
/* harmony import */ var _misc_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc.mjs */ "./node_modules/@metamask/utils/dist/misc.mjs");


/**
 * Type guard for determining whether the given value is an instance of Error.
 * For errors generated via `fs.promises`, `error instanceof Error` won't work,
 * so we have to come up with another way of testing.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isError(error) {
    return (error instanceof Error ||
        ((0,_misc_mjs__WEBPACK_IMPORTED_MODULE_1__.isObject)(error) && error.constructor.name === 'Error'));
}
/**
 * Type guard for determining whether the given value is an error object with a
 * `code` property such as the type of error that Node throws for filesystem
 * operations, etc.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithCode(error) {
    return typeof error === 'object' && error !== null && 'code' in error;
}
/**
 * Type guard for determining whether the given value is an error object with a
 * `message` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithMessage(error) {
    return typeof error === 'object' && error !== null && 'message' in error;
}
/**
 * Type guard for determining whether the given value is an error object with a
 * `stack` property, such as an instance of Error.
 *
 * @param error - The object to check.
 * @returns A boolean.
 */
function isErrorWithStack(error) {
    return typeof error === 'object' && error !== null && 'stack' in error;
}
/**
 * Attempts to obtain the message from a possible error object, defaulting to an
 * empty string if it is impossible to do so.
 *
 * @param error - The possible error to get the message from.
 * @returns The message if `error` is an object with a `message` property;
 * the string version of `error` if it is not `undefined` or `null`; otherwise
 * an empty string.
 */
function getErrorMessage(error) {
    if (isErrorWithMessage(error) && typeof error.message === 'string') {
        return error.message;
    }
    if ((0,_misc_mjs__WEBPACK_IMPORTED_MODULE_1__.isNullOrUndefined)(error)) {
        return '';
    }
    return String(error);
}
/**
 * Builds a new error object, linking it to the original error via the `cause`
 * property if it is an Error.
 *
 * This function is useful to reframe error messages in general, but is
 * _critical_ when interacting with any of Node's filesystem functions as
 * provided via `fs.promises`, because these do not produce stack traces in the
 * case of an I/O error (see <https://github.com/nodejs/node/issues/30944>).
 *
 * @param originalError - The error to be wrapped (something throwable).
 * @param message - The desired message of the new error.
 * @returns A new error object.
 */
function wrapError(originalError, message) {
    if (isError(originalError)) {
        let error;
        if (Error.length === 2) {
            // for some reason `tsserver` is not complaining that the
            // Error constructor doesn't support a second argument in the editor,
            // but `tsc` does. Error causes are not supported by our current tsc target (ES2020, we need ES2022 to make this work)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error = new Error(message, { cause: originalError });
        }
        else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            error = new pony_cause__WEBPACK_IMPORTED_MODULE_0__.ErrorWithCause(message, { cause: originalError });
        }
        if (isErrorWithCode(originalError)) {
            error.code = originalError.code;
        }
        return error;
    }
    if (message.length > 0) {
        return new Error(`${String(originalError)}: ${message}`);
    }
    return new Error(String(originalError));
}
//# sourceMappingURL=errors.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/utils/dist/json.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@metamask/utils/dist/json.mjs ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JsonRpcErrorStruct": () => (/* binding */ JsonRpcErrorStruct),
/* harmony export */   "JsonRpcFailureStruct": () => (/* binding */ JsonRpcFailureStruct),
/* harmony export */   "JsonRpcIdStruct": () => (/* binding */ JsonRpcIdStruct),
/* harmony export */   "JsonRpcNotificationStruct": () => (/* binding */ JsonRpcNotificationStruct),
/* harmony export */   "JsonRpcParamsStruct": () => (/* binding */ JsonRpcParamsStruct),
/* harmony export */   "JsonRpcRequestStruct": () => (/* binding */ JsonRpcRequestStruct),
/* harmony export */   "JsonRpcResponseStruct": () => (/* binding */ JsonRpcResponseStruct),
/* harmony export */   "JsonRpcSuccessStruct": () => (/* binding */ JsonRpcSuccessStruct),
/* harmony export */   "JsonRpcVersionStruct": () => (/* binding */ JsonRpcVersionStruct),
/* harmony export */   "JsonStruct": () => (/* binding */ JsonStruct),
/* harmony export */   "PendingJsonRpcResponseStruct": () => (/* binding */ PendingJsonRpcResponseStruct),
/* harmony export */   "UnsafeJsonStruct": () => (/* binding */ UnsafeJsonStruct),
/* harmony export */   "assertIsJsonRpcError": () => (/* binding */ assertIsJsonRpcError),
/* harmony export */   "assertIsJsonRpcFailure": () => (/* binding */ assertIsJsonRpcFailure),
/* harmony export */   "assertIsJsonRpcNotification": () => (/* binding */ assertIsJsonRpcNotification),
/* harmony export */   "assertIsJsonRpcRequest": () => (/* binding */ assertIsJsonRpcRequest),
/* harmony export */   "assertIsJsonRpcResponse": () => (/* binding */ assertIsJsonRpcResponse),
/* harmony export */   "assertIsJsonRpcSuccess": () => (/* binding */ assertIsJsonRpcSuccess),
/* harmony export */   "assertIsPendingJsonRpcResponse": () => (/* binding */ assertIsPendingJsonRpcResponse),
/* harmony export */   "exactOptional": () => (/* binding */ exactOptional),
/* harmony export */   "getJsonRpcIdValidator": () => (/* binding */ getJsonRpcIdValidator),
/* harmony export */   "getJsonSize": () => (/* binding */ getJsonSize),
/* harmony export */   "getSafeJson": () => (/* binding */ getSafeJson),
/* harmony export */   "isJsonRpcError": () => (/* binding */ isJsonRpcError),
/* harmony export */   "isJsonRpcFailure": () => (/* binding */ isJsonRpcFailure),
/* harmony export */   "isJsonRpcNotification": () => (/* binding */ isJsonRpcNotification),
/* harmony export */   "isJsonRpcRequest": () => (/* binding */ isJsonRpcRequest),
/* harmony export */   "isJsonRpcResponse": () => (/* binding */ isJsonRpcResponse),
/* harmony export */   "isJsonRpcSuccess": () => (/* binding */ isJsonRpcSuccess),
/* harmony export */   "isPendingJsonRpcResponse": () => (/* binding */ isPendingJsonRpcResponse),
/* harmony export */   "isValidJson": () => (/* binding */ isValidJson),
/* harmony export */   "jsonrpc2": () => (/* binding */ jsonrpc2),
/* harmony export */   "object": () => (/* binding */ object)
/* harmony export */ });
/* harmony import */ var _metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @metamask/superstruct */ "./node_modules/@metamask/superstruct/dist/structs/types.mjs");
/* harmony import */ var _metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @metamask/superstruct */ "./node_modules/@metamask/superstruct/dist/struct.mjs");
/* harmony import */ var _metamask_superstruct__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @metamask/superstruct */ "./node_modules/@metamask/superstruct/dist/structs/utilities.mjs");
/* harmony import */ var _metamask_superstruct__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @metamask/superstruct */ "./node_modules/@metamask/superstruct/dist/structs/coercions.mjs");
/* harmony import */ var _assert_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./assert.mjs */ "./node_modules/@metamask/utils/dist/assert.mjs");
/* harmony import */ var _misc_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc.mjs */ "./node_modules/@metamask/utils/dist/misc.mjs");



/**
 * A struct to check if the given value is a valid object, with support for
 * {@link exactOptional} types.
 *
 * @param schema - The schema of the object.
 * @returns A struct to check if the given value is an object.
 */
const object = (schema) => 
// The type is slightly different from a regular object struct, because we
// want to make properties with `undefined` in their type optional, but not
// `undefined` itself. This means that we need a type cast.
(0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.object)(schema);
/**
 * Check the last field of a path is present.
 *
 * @param context - The context to check.
 * @param context.path - The path to check.
 * @param context.branch - The branch to check.
 * @returns Whether the last field of a path is present.
 */
function hasOptional({ path, branch }) {
    const field = path[path.length - 1];
    return (0,_misc_mjs__WEBPACK_IMPORTED_MODULE_1__.hasProperty)(branch[branch.length - 2], field);
}
/**
 * A struct which allows the property of an object to be absent, or to be present
 * as long as it's valid and not set to `undefined`.
 *
 * This struct should be used in conjunction with the {@link object} from this
 * library, to get proper type inference.
 *
 * @param struct - The struct to check the value against, if present.
 * @returns A struct to check if the given value is valid, or not present.
 * @example
 * ```ts
 * const struct = object({
 *   foo: exactOptional(string()),
 *   bar: exactOptional(number()),
 *   baz: optional(boolean()),
 *   qux: unknown(),
 * });
 *
 * type Type = Infer<typeof struct>;
 * // Type is equivalent to:
 * // {
 * //   foo?: string;
 * //   bar?: number;
 * //   baz?: boolean | undefined;
 * //   qux: unknown;
 * // }
 * ```
 */
function exactOptional(struct) {
    return new _metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.Struct({
        ...struct,
        type: `optional ${struct.type}`,
        validator: (value, context) => !hasOptional(context) || struct.validator(value, context),
        refiner: (value, context) => !hasOptional(context) || struct.refiner(value, context),
    });
}
/**
 * A struct to check if the given value is finite number. Superstruct's
 * `number()` struct does not check if the value is finite.
 *
 * @returns A struct to check if the given value is finite number.
 */
const finiteNumber = () => (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_3__.define)('finite number', (value) => {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.number)()) && Number.isFinite(value);
});
/**
 * A struct to check if the given value is a valid JSON-serializable value.
 *
 * Note that this struct is unsafe. For safe validation, use {@link JsonStruct}.
 */
// We cannot infer the type of the struct, because it is recursive.
const UnsafeJsonStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.union)([
    (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.literal)(null),
    (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.boolean)(),
    finiteNumber(),
    (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(),
    (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.array)((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_3__.lazy)(() => UnsafeJsonStruct)),
    (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.record)((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(), (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_3__.lazy)(() => UnsafeJsonStruct)),
]);
/**
 * A struct to check if the given value is a valid JSON-serializable value.
 *
 * This struct sanitizes the value before validating it, so that it is safe to
 * use with untrusted input.
 */
const JsonStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_4__.coerce)(UnsafeJsonStruct, (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.any)(), (value) => {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, UnsafeJsonStruct);
    return JSON.parse(JSON.stringify(value, (propKey, propValue) => {
        // Strip __proto__ and constructor properties to prevent prototype pollution.
        if (propKey === '__proto__' || propKey === 'constructor') {
            return undefined;
        }
        return propValue;
    }));
});
/**
 * Check if the given value is a valid {@link Json} value, i.e., a value that is
 * serializable to JSON.
 *
 * @param value - The value to check.
 * @returns Whether the value is a valid {@link Json} value.
 */
function isValidJson(value) {
    try {
        getSafeJson(value);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Validate and return sanitized JSON.
 *
 * Note:
 * This function uses sanitized JsonStruct for validation
 * that applies stringify and then parse of a value provided
 * to ensure that there are no getters which can have side effects
 * that can cause security issues.
 *
 * @param value - JSON structure to be processed.
 * @returns Sanitized JSON structure.
 */
function getSafeJson(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.create)(value, JsonStruct);
}
/**
 * Get the size of a JSON value in bytes. This also validates the value.
 *
 * @param value - The JSON value to get the size of.
 * @returns The size of the JSON value in bytes.
 */
function getJsonSize(value) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonStruct, 'Invalid JSON value');
    const json = JSON.stringify(value);
    return new TextEncoder().encode(json).byteLength;
}
/**
 * The string '2.0'.
 */
const jsonrpc2 = '2.0';
const JsonRpcVersionStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.literal)(jsonrpc2);
const JsonRpcIdStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.nullable)((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.union)([(0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.number)(), (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)()]));
const JsonRpcErrorStruct = object({
    code: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.integer)(),
    message: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(),
    data: exactOptional(JsonStruct),
    stack: exactOptional((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)()),
});
const JsonRpcParamsStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.union)([(0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.record)((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(), JsonStruct), (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.array)(JsonStruct)]);
const JsonRpcRequestStruct = object({
    id: JsonRpcIdStruct,
    jsonrpc: JsonRpcVersionStruct,
    method: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(),
    params: exactOptional(JsonRpcParamsStruct),
});
const JsonRpcNotificationStruct = object({
    jsonrpc: JsonRpcVersionStruct,
    method: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.string)(),
    params: exactOptional(JsonRpcParamsStruct),
});
/**
 * Check if the given value is a valid {@link JsonRpcNotification} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcNotification}
 * object.
 */
function isJsonRpcNotification(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, JsonRpcNotificationStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcNotification} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcNotification} object.
 */
function assertIsJsonRpcNotification(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcNotificationStruct, 'Invalid JSON-RPC notification', ErrorWrapper);
}
/**
 * Check if the given value is a valid {@link JsonRpcRequest} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcRequest} object.
 */
function isJsonRpcRequest(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, JsonRpcRequestStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcRequest} object.
 *
 * @param value - The JSON-RPC request or notification to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcRequest} object.
 */
function assertIsJsonRpcRequest(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcRequestStruct, 'Invalid JSON-RPC request', ErrorWrapper);
}
const PendingJsonRpcResponseStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.object)({
    id: JsonRpcIdStruct,
    jsonrpc: JsonRpcVersionStruct,
    result: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.optional)((0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.unknown)()),
    error: (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.optional)(JsonRpcErrorStruct),
});
const JsonRpcSuccessStruct = object({
    id: JsonRpcIdStruct,
    jsonrpc: JsonRpcVersionStruct,
    result: JsonStruct,
});
const JsonRpcFailureStruct = object({
    id: JsonRpcIdStruct,
    jsonrpc: JsonRpcVersionStruct,
    error: JsonRpcErrorStruct,
});
const JsonRpcResponseStruct = (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_0__.union)([
    JsonRpcSuccessStruct,
    JsonRpcFailureStruct,
]);
/**
 * Type guard to check whether specified JSON-RPC response is a
 * {@link PendingJsonRpcResponse}.
 *
 * @param response - The JSON-RPC response to check.
 * @returns Whether the specified JSON-RPC response is pending.
 */
function isPendingJsonRpcResponse(response) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(response, PendingJsonRpcResponseStruct);
}
/**
 * Assert that the given value is a valid {@link PendingJsonRpcResponse} object.
 *
 * @param response - The JSON-RPC response to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link PendingJsonRpcResponse}
 * object.
 */
function assertIsPendingJsonRpcResponse(response, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(response, PendingJsonRpcResponseStruct, 'Invalid pending JSON-RPC response', ErrorWrapper);
}
/**
 * Type guard to check if a value is a {@link JsonRpcResponse}.
 *
 * @param response - The object to check.
 * @returns Whether the object is a JsonRpcResponse.
 */
function isJsonRpcResponse(response) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(response, JsonRpcResponseStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcResponse} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcResponse} object.
 */
function assertIsJsonRpcResponse(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcResponseStruct, 'Invalid JSON-RPC response', ErrorWrapper);
}
/**
 * Check if the given value is a valid {@link JsonRpcSuccess} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcSuccess} object.
 */
function isJsonRpcSuccess(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, JsonRpcSuccessStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcSuccess} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcSuccess} object.
 */
function assertIsJsonRpcSuccess(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcSuccessStruct, 'Invalid JSON-RPC success response', ErrorWrapper);
}
/**
 * Check if the given value is a valid {@link JsonRpcFailure} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcFailure} object.
 */
function isJsonRpcFailure(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, JsonRpcFailureStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcFailure} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcFailure} object.
 */
function assertIsJsonRpcFailure(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcFailureStruct, 'Invalid JSON-RPC failure response', ErrorWrapper);
}
/**
 * Check if the given value is a valid {@link JsonRpcError} object.
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid {@link JsonRpcError} object.
 */
function isJsonRpcError(value) {
    return (0,_metamask_superstruct__WEBPACK_IMPORTED_MODULE_2__.is)(value, JsonRpcErrorStruct);
}
/**
 * Assert that the given value is a valid {@link JsonRpcError} object.
 *
 * @param value - The value to check.
 * @param ErrorWrapper - The error class to throw if the assertion fails.
 * Defaults to {@link AssertionError}.
 * @throws If the given value is not a valid {@link JsonRpcError} object.
 */
function assertIsJsonRpcError(value, 
// eslint-disable-next-line @typescript-eslint/naming-convention
ErrorWrapper) {
    (0,_assert_mjs__WEBPACK_IMPORTED_MODULE_5__.assertStruct)(value, JsonRpcErrorStruct, 'Invalid JSON-RPC error', ErrorWrapper);
}
/**
 * Gets a function for validating JSON-RPC request / response `id` values.
 *
 * By manipulating the options of this factory, you can control the behavior
 * of the resulting validator for some edge cases. This is useful because e.g.
 * `null` should sometimes but not always be permitted.
 *
 * Note that the empty string (`''`) is always permitted by the JSON-RPC
 * specification, but that kind of sucks and you may want to forbid it in some
 * instances anyway.
 *
 * For more details, see the
 * [JSON-RPC Specification](https://www.jsonrpc.org/specification).
 *
 * @param options - An options object.
 * @param options.permitEmptyString - Whether the empty string (i.e. `''`)
 * should be treated as a valid ID. Default: `true`
 * @param options.permitFractions - Whether fractional numbers (e.g. `1.2`)
 * should be treated as valid IDs. Default: `false`
 * @param options.permitNull - Whether `null` should be treated as a valid ID.
 * Default: `true`
 * @returns The JSON-RPC ID validator function.
 */
function getJsonRpcIdValidator(options) {
    const { permitEmptyString, permitFractions, permitNull } = {
        permitEmptyString: true,
        permitFractions: false,
        permitNull: true,
        ...options,
    };
    /**
     * Type guard for {@link JsonRpcId}.
     *
     * @param id - The JSON-RPC ID value to check.
     * @returns Whether the given ID is valid per the options given to the
     * factory.
     */
    const isValidJsonRpcId = (id) => {
        return Boolean((typeof id === 'number' && (permitFractions || Number.isInteger(id))) ||
            (typeof id === 'string' && (permitEmptyString || id.length > 0)) ||
            (permitNull && id === null));
    };
    return isValidJsonRpcId;
}
//# sourceMappingURL=json.mjs.map

/***/ }),

/***/ "./node_modules/@metamask/utils/dist/misc.mjs":
/*!****************************************************!*\
  !*** ./node_modules/@metamask/utils/dist/misc.mjs ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ESCAPE_CHARACTERS_REGEXP": () => (/* binding */ ESCAPE_CHARACTERS_REGEXP),
/* harmony export */   "JsonSize": () => (/* binding */ JsonSize),
/* harmony export */   "calculateNumberSize": () => (/* binding */ calculateNumberSize),
/* harmony export */   "calculateStringSize": () => (/* binding */ calculateStringSize),
/* harmony export */   "getKnownPropertyNames": () => (/* binding */ getKnownPropertyNames),
/* harmony export */   "hasProperty": () => (/* binding */ hasProperty),
/* harmony export */   "isASCII": () => (/* binding */ isASCII),
/* harmony export */   "isNonEmptyArray": () => (/* binding */ isNonEmptyArray),
/* harmony export */   "isNullOrUndefined": () => (/* binding */ isNullOrUndefined),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject)
/* harmony export */ });
//
// Types
//
//
// Type Guards
//
/**
 * A {@link NonEmptyArray} type guard.
 *
 * @template Element - The non-empty array member type.
 * @param value - The value to check.
 * @returns Whether the value is a non-empty array.
 */
function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Type guard for "nullishness".
 *
 * @param value - Any value.
 * @returns `true` if the value is null or undefined, `false` otherwise.
 */
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
/**
 * A type guard for {@link RuntimeObject}.
 *
 * @param value - The value to check.
 * @returns Whether the specified value has a runtime type of `object` and is
 * neither `null` nor an `Array`.
 */
function isObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
//
// Other utility functions
//
/**
 * A type guard for ensuring an object has a property.
 *
 * @param objectToCheck - The object to check.
 * @param name - The property name to check for.
 * @returns Whether the specified object has an own property with the specified
 * name, regardless of whether it is enumerable or not.
 */
const hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
/**
 * `Object.getOwnPropertyNames()` is intentionally generic: it returns the
 * immediate property names of an object, but it cannot make guarantees about
 * the contents of that object, so the type of the property names is merely
 * `string[]`. While this is technically accurate, it is also unnecessary if we
 * have an object with a type that we own (such as an enum).
 *
 * @param object - The plain object.
 * @returns The own property names of the object which are assigned a type
 * derived from the object itself.
 */
function getKnownPropertyNames(object) {
    return Object.getOwnPropertyNames(object);
}
/**
 * Predefined sizes (in Bytes) of specific parts of JSON structure.
 */
var JsonSize;
(function (JsonSize) {
    JsonSize[JsonSize["Null"] = 4] = "Null";
    JsonSize[JsonSize["Comma"] = 1] = "Comma";
    JsonSize[JsonSize["Wrapper"] = 1] = "Wrapper";
    JsonSize[JsonSize["True"] = 4] = "True";
    JsonSize[JsonSize["False"] = 5] = "False";
    JsonSize[JsonSize["Quote"] = 1] = "Quote";
    JsonSize[JsonSize["Colon"] = 1] = "Colon";
    // eslint-disable-next-line @typescript-eslint/no-shadow
    JsonSize[JsonSize["Date"] = 24] = "Date";
})(JsonSize = JsonSize || (JsonSize = {}));
/**
 * Regular expression with pattern matching for (special) escaped characters.
 */
const ESCAPE_CHARACTERS_REGEXP = /"|\\|\n|\r|\t/gu;
/**
 * Check if the value is plain object.
 *
 * @param value - Value to be checked.
 * @returns True if an object is the plain JavaScript object,
 * false if the object is not plain (e.g. function).
 */
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    try {
        let proto = value;
        while (Object.getPrototypeOf(proto) !== null) {
            proto = Object.getPrototypeOf(proto);
        }
        return Object.getPrototypeOf(value) === proto;
    }
    catch (_) {
        return false;
    }
}
/**
 * Check if character is ASCII.
 *
 * @param character - Character.
 * @returns True if a character code is ASCII, false if not.
 */
function isASCII(character) {
    return character.charCodeAt(0) <= 127;
}
/**
 * Calculate string size.
 *
 * @param value - String value to calculate size.
 * @returns Number of bytes used to store whole string value.
 */
function calculateStringSize(value) {
    const size = value.split('').reduce((total, character) => {
        if (isASCII(character)) {
            return total + 1;
        }
        return total + 2;
    }, 0);
    // Also detect characters that need backslash escape
    return size + (value.match(ESCAPE_CHARACTERS_REGEXP) ?? []).length;
}
/**
 * Calculate size of a number ofter JSON serialization.
 *
 * @param value - Number value to calculate size.
 * @returns Number of bytes used to store whole number in JSON.
 */
function calculateNumberSize(value) {
    return value.toString().length;
}
//# sourceMappingURL=misc.mjs.map

/***/ }),

/***/ "./node_modules/@scure/base/lib/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@scure/base/lib/esm/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assertNumber": () => (/* binding */ assertNumber),
/* harmony export */   "base16": () => (/* binding */ base16),
/* harmony export */   "base32": () => (/* binding */ base32),
/* harmony export */   "base32crockford": () => (/* binding */ base32crockford),
/* harmony export */   "base32hex": () => (/* binding */ base32hex),
/* harmony export */   "base32hexnopad": () => (/* binding */ base32hexnopad),
/* harmony export */   "base32nopad": () => (/* binding */ base32nopad),
/* harmony export */   "base58": () => (/* binding */ base58),
/* harmony export */   "base58check": () => (/* binding */ base58check),
/* harmony export */   "base58flickr": () => (/* binding */ base58flickr),
/* harmony export */   "base58xmr": () => (/* binding */ base58xmr),
/* harmony export */   "base58xrp": () => (/* binding */ base58xrp),
/* harmony export */   "base64": () => (/* binding */ base64),
/* harmony export */   "base64nopad": () => (/* binding */ base64nopad),
/* harmony export */   "base64url": () => (/* binding */ base64url),
/* harmony export */   "base64urlnopad": () => (/* binding */ base64urlnopad),
/* harmony export */   "bech32": () => (/* binding */ bech32),
/* harmony export */   "bech32m": () => (/* binding */ bech32m),
/* harmony export */   "bytes": () => (/* binding */ bytes),
/* harmony export */   "bytesToString": () => (/* binding */ bytesToString),
/* harmony export */   "createBase58check": () => (/* binding */ createBase58check),
/* harmony export */   "hex": () => (/* binding */ hex),
/* harmony export */   "str": () => (/* binding */ str),
/* harmony export */   "stringToBytes": () => (/* binding */ stringToBytes),
/* harmony export */   "utf8": () => (/* binding */ utf8),
/* harmony export */   "utils": () => (/* binding */ utils)
/* harmony export */ });
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}
function isArrayOf(isString, arr) {
    if (!Array.isArray(arr))
        return false;
    if (arr.length === 0)
        return true;
    if (isString) {
        return arr.every((item) => typeof item === 'string');
    }
    else {
        return arr.every((item) => Number.isSafeInteger(item));
    }
}
// no abytes: seems to have 10% slowdown. Why?!
function afn(input) {
    if (typeof input !== 'function')
        throw new Error('function expected');
    return true;
}
function astr(label, input) {
    if (typeof input !== 'string')
        throw new Error(`${label}: string expected`);
    return true;
}
function anumber(n) {
    if (!Number.isSafeInteger(n))
        throw new Error(`invalid integer: ${n}`);
}
const assertNumber = anumber;
function aArr(input) {
    if (!Array.isArray(input))
        throw new Error('array expected');
}
function astrArr(label, input) {
    if (!isArrayOf(true, input))
        throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
    if (!isArrayOf(false, input))
        throw new Error(`${label}: array of numbers expected`);
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function chain(...args) {
    const id = (a) => a;
    // Wrap call in closure so JIT can inline calls
    const wrap = (a, b) => (c) => a(b(c));
    // Construct chain of args[-1].encode(args[-2].encode([...]))
    const encode = args.map((x) => x.encode).reduceRight(wrap, id);
    // Construct chain of args[0].decode(args[1].decode(...))
    const decode = args.map((x) => x.decode).reduce(wrap, id);
    return { encode, decode };
}
/**
 * Encodes integer radix representation to array of strings using alphabet and back.
 * Could also be array of strings.
 * @__NO_SIDE_EFFECTS__
 */
function alphabet(letters) {
    // mapping 1 to "b"
    const lettersA = typeof letters === 'string' ? letters.split('') : letters;
    const len = lettersA.length;
    astrArr('alphabet', lettersA);
    // mapping "b" to 1
    const indexes = new Map(lettersA.map((l, i) => [l, i]));
    return {
        encode: (digits) => {
            aArr(digits);
            return digits.map((i) => {
                if (!Number.isSafeInteger(i) || i < 0 || i >= len)
                    throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
                return lettersA[i];
            });
        },
        decode: (input) => {
            aArr(input);
            return input.map((letter) => {
                astr('alphabet.decode', letter);
                const i = indexes.get(letter);
                if (i === undefined)
                    throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
                return i;
            });
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function join(separator = '') {
    astr('join', separator);
    return {
        encode: (from) => {
            astrArr('join.decode', from);
            return from.join(separator);
        },
        decode: (to) => {
            astr('join.decode', to);
            return to.split(separator);
        },
    };
}
/**
 * Pad strings array so it has integer number of bits
 * @__NO_SIDE_EFFECTS__
 */
function padding(bits, chr = '=') {
    anumber(bits);
    astr('padding', chr);
    return {
        encode(data) {
            astrArr('padding.encode', data);
            while ((data.length * bits) % 8)
                data.push(chr);
            return data;
        },
        decode(input) {
            astrArr('padding.decode', input);
            let end = input.length;
            if ((end * bits) % 8)
                throw new Error('padding: invalid, string should have whole number of bytes');
            for (; end > 0 && input[end - 1] === chr; end--) {
                const last = end - 1;
                const byte = last * bits;
                if (byte % 8 === 0)
                    throw new Error('padding: invalid, string has too much padding');
            }
            return input.slice(0, end);
        },
    };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function normalize(fn) {
    afn(fn);
    return { encode: (from) => from, decode: (to) => fn(to) };
}
/**
 * Slow: O(n^2) time complexity
 */
function convertRadix(data, from, to) {
    // base 1 is impossible
    if (from < 2)
        throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
    if (to < 2)
        throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
    aArr(data);
    if (!data.length)
        return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data, (d) => {
        anumber(d);
        if (d < 0 || d >= from)
            throw new Error(`invalid integer: ${d}`);
        return d;
    });
    const dlen = digits.length;
    while (true) {
        let carry = 0;
        let done = true;
        for (let i = pos; i < dlen; i++) {
            const digit = digits[i];
            const fromCarry = from * carry;
            const digitBase = fromCarry + digit;
            if (!Number.isSafeInteger(digitBase) ||
                fromCarry / from !== carry ||
                digitBase - digit !== fromCarry) {
                throw new Error('convertRadix: carry overflow');
            }
            const div = digitBase / to;
            carry = digitBase % to;
            const rounded = Math.floor(div);
            digits[i] = rounded;
            if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
                throw new Error('convertRadix: carry overflow');
            if (!done)
                continue;
            else if (!rounded)
                pos = i;
            else
                done = false;
        }
        res.push(carry);
        if (done)
            break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
        res.push(0);
    return res.reverse();
}
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
const powers = /* @__PURE__ */ (() => {
    let res = [];
    for (let i = 0; i < 40; i++)
        res.push(2 ** i);
    return res;
})();
/**
 * Implemented with numbers, because BigInt is 5x slower
 */
function convertRadix2(data, from, to, padding) {
    aArr(data);
    if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
    if (radix2carry(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0; // bitwise position in current element
    const max = powers[from];
    const mask = powers[to] - 1;
    const res = [];
    for (const n of data) {
        anumber(n);
        if (n >= max)
            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
            res.push(((carry >> (pos - to)) & mask) >>> 0);
        const pow = powers[pos];
        if (pow === undefined)
            throw new Error('invalid carry');
        carry &= pow - 1; // clean carry, otherwise it will cause overflow
    }
    carry = (carry << (to - pos)) & mask;
    if (!padding && pos >= from)
        throw new Error('Excess padding');
    if (!padding && carry > 0)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.push(carry >>> 0);
    return res;
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function radix(num) {
    anumber(num);
    const _256 = 2 ** 8;
    return {
        encode: (bytes) => {
            if (!isBytes(bytes))
                throw new Error('radix.encode input should be Uint8Array');
            return convertRadix(Array.from(bytes), _256, num);
        },
        decode: (digits) => {
            anumArr('radix.decode', digits);
            return Uint8Array.from(convertRadix(digits, num, _256));
        },
    };
}
/**
 * If both bases are power of same number (like `2**8 <-> 2**64`),
 * there is a linear algorithm. For now we have implementation for power-of-two bases only.
 * @__NO_SIDE_EFFECTS__
 */
function radix2(bits, revPadding = false) {
    anumber(bits);
    if (bits <= 0 || bits > 32)
        throw new Error('radix2: bits should be in (0..32]');
    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
        throw new Error('radix2: carry overflow');
    return {
        encode: (bytes) => {
            if (!isBytes(bytes))
                throw new Error('radix2.encode input should be Uint8Array');
            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
            anumArr('radix2.decode', digits);
            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
        },
    };
}
function unsafeWrapper(fn) {
    afn(fn);
    return function (...args) {
        try {
            return fn.apply(null, args);
        }
        catch (e) { }
    };
}
function checksum(len, fn) {
    anumber(len);
    afn(fn);
    return {
        encode(data) {
            if (!isBytes(data))
                throw new Error('checksum.encode: input should be Uint8Array');
            const sum = fn(data).slice(0, len);
            const res = new Uint8Array(data.length + len);
            res.set(data);
            res.set(sum, data.length);
            return res;
        },
        decode(data) {
            if (!isBytes(data))
                throw new Error('checksum.decode: input should be Uint8Array');
            const payload = data.slice(0, -len);
            const oldChecksum = data.slice(-len);
            const newChecksum = fn(payload).slice(0, len);
            for (let i = 0; i < len; i++)
                if (newChecksum[i] !== oldChecksum[i])
                    throw new Error('Invalid checksum');
            return payload;
        },
    };
}
// prettier-ignore
const utils = {
    alphabet, chain, checksum, convertRadix, convertRadix2, radix, radix2, join, padding,
};
// RFC 4648 aka RFC 3548
// ---------------------
/**
 * base16 encoding.
 */
const base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
const base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
const base32nopad = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), join(''));
const base32hex = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
const base32hexnopad = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), join(''));
const base32crockford = chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
/**
 * base64 with padding. For no padding, use `base64nopad`.
 * @example
 * const b = base64.decode('A951'); // Uint8Array.from([ 3, 222, 117 ])
 * base64.encode(b); // 'A951'
 */
const base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
/**
 * base64 without padding.
 */
const base64nopad = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), join(''));
const base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
const base64urlnopad = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), join(''));
// base58 code
// -----------
const genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => chain(radix(58), alphabet(abc), join(''));
/**
 * Base58: base64 without characters +, /, 0, O, I, l.
 * Quadratic (O(n^2)) - so, can't be used on large inputs.
 */
const base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
const base58flickr = genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
const base58xrp = genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
// Data len (index) -> encoded block len
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
/**
 * XMR version of base58.
 * Done in 8-byte blocks (which equals 11 chars in decoding). Last (non-full) block padded with '1' to size in XMR_BLOCK_LEN.
 * Block encoding significantly reduces quadratic complexity of base58.
 */
const base58xmr = {
    encode(data) {
        let res = '';
        for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
        }
        return res;
    },
    decode(str) {
        let res = [];
        for (let i = 0; i < str.length; i += 11) {
            const slice = str.slice(i, i + 11);
            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
            const block = base58.decode(slice);
            for (let j = 0; j < block.length - blockLen; j++) {
                if (block[j] !== 0)
                    throw new Error('base58xmr: wrong padding');
            }
            res = res.concat(Array.from(block.slice(block.length - blockLen)));
        }
        return Uint8Array.from(res);
    },
};
const createBase58check = (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), base58);
/**
 * Use `createBase58check` instead.
 * @deprecated
 */
const base58check = createBase58check;
const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod(pre) {
    const b = pre >> 25;
    let chk = (pre & 0x1ffffff) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
        if (((b >> i) & 1) === 1)
            chk ^= POLYMOD_GENERATORS[i];
    }
    return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod(chk) ^ (c >> 5);
    }
    chk = bech32Polymod(chk);
    for (let i = 0; i < len; i++)
        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
    for (let v of words)
        chk = bech32Polymod(chk) ^ v;
    for (let i = 0; i < 6; i++)
        chk = bech32Polymod(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function genBech32(encoding) {
    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
    const _words = radix2(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
        astr('bech32.encode prefix', prefix);
        if (isBytes(words))
            words = Array.from(words);
        anumArr('bech32.encode', words);
        const plen = prefix.length;
        if (plen === 0)
            throw new TypeError(`Invalid prefix length ${plen}`);
        const actualLength = plen + 7 + words.length;
        if (limit !== false && actualLength > limit)
            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        const lowered = prefix.toLowerCase();
        const sum = bechChecksum(lowered, words, ENCODING_CONST);
        return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
    }
    function decode(str, limit = 90) {
        astr('bech32.decode input', str);
        const slen = str.length;
        if (slen < 8 || (limit !== false && slen > limit))
            throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
        // don't allow mixed case
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
            throw new Error(`String must be lowercase or uppercase`);
        const sepIndex = lowered.lastIndexOf('1');
        if (sepIndex === 0 || sepIndex === -1)
            throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = lowered.slice(0, sepIndex);
        const data = lowered.slice(sepIndex + 1);
        if (data.length < 6)
            throw new Error('Data must be at least 6 characters long');
        const words = BECH_ALPHABET.decode(data).slice(0, -6);
        const sum = bechChecksum(prefix, words, ENCODING_CONST);
        if (!data.endsWith(sum))
            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode);
    function decodeToBytes(str) {
        const { prefix, words } = decode(str, false);
        return { prefix, words, bytes: fromWords(words) };
    }
    function encodeFromBytes(prefix, bytes) {
        return encode(prefix, toWords(bytes));
    }
    return {
        encode,
        decode,
        encodeFromBytes,
        decodeToBytes,
        decodeUnsafe,
        fromWords,
        fromWordsUnsafe,
        toWords,
    };
}
/**
 * Low-level bech32 operations. Operates on words.
 */
const bech32 = genBech32('bech32');
const bech32m = genBech32('bech32m');
/**
 * UTF-8-to-byte decoder. Uses built-in TextDecoder / TextEncoder.
 * @example
 * const b = utf8.decode("hey"); // => new Uint8Array([ 104, 101, 121 ])
 * const str = utf8.encode(b); // "hey"
 */
const utf8 = {
    encode: (data) => new TextDecoder().decode(data),
    decode: (str) => new TextEncoder().encode(str),
};
/**
 * hex string decoder.
 * @example
 * const b = hex.decode("0102ff"); // => new Uint8Array([ 1, 2, 255 ])
 * const str = hex.encode(b); // "0102ff"
 */
const hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize((s) => {
    if (typeof s !== 'string' || s.length % 2 !== 0)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
    return s.toLowerCase();
}));
// prettier-ignore
const CODERS = {
    utf8, hex, base16, base32, base64, base64url, base58, base58xmr
};
const coderTypeError = 'Invalid encoding type. Available types: utf8, hex, base16, base32, base64, base64url, base58, base58xmr';
const bytesToString = (type, bytes) => {
    if (typeof type !== 'string' || !CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (!isBytes(bytes))
        throw new TypeError('bytesToString() expects Uint8Array');
    return CODERS[type].encode(bytes);
};
const str = bytesToString; // as in python, but for bytes only
const stringToBytes = (type, str) => {
    if (!CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (typeof str !== 'string')
        throw new TypeError('stringToBytes() expects string');
    return CODERS[type].decode(str);
};
const bytes = stringToBytes;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SolanaSignAndSendTransaction": () => (/* binding */ SolanaSignAndSendTransaction)
/* harmony export */ });
/** Name of the feature. */
const SolanaSignAndSendTransaction = 'solana:signAndSendTransaction';
//# sourceMappingURL=signAndSendTransaction.js.map

/***/ }),

/***/ "./node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SolanaSignTransaction": () => (/* binding */ SolanaSignTransaction)
/* harmony export */ });
/** Name of the feature. */
const SolanaSignTransaction = 'solana:signTransaction';
//# sourceMappingURL=signTransaction.js.map

/***/ }),

/***/ "./node_modules/@wallet-standard/features/lib/esm/connect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@wallet-standard/features/lib/esm/connect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Connect": () => (/* binding */ Connect),
/* harmony export */   "StandardConnect": () => (/* binding */ StandardConnect)
/* harmony export */ });
/** Name of the feature. */
const StandardConnect = 'standard:connect';
/**
 * @deprecated Use {@link StandardConnect} instead.
 *
 * @group Deprecated
 */
const Connect = StandardConnect;
//# sourceMappingURL=connect.js.map

/***/ }),

/***/ "./node_modules/@wallet-standard/features/lib/esm/disconnect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@wallet-standard/features/lib/esm/disconnect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Disconnect": () => (/* binding */ Disconnect),
/* harmony export */   "StandardDisconnect": () => (/* binding */ StandardDisconnect)
/* harmony export */ });
/** Name of the feature. */
const StandardDisconnect = 'standard:disconnect';
/**
 * @deprecated Use {@link StandardDisconnect} instead.
 *
 * @group Deprecated
 */
const Disconnect = StandardDisconnect;
//# sourceMappingURL=disconnect.js.map

/***/ }),

/***/ "./node_modules/@wallet-standard/features/lib/esm/events.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wallet-standard/features/lib/esm/events.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Events": () => (/* binding */ Events),
/* harmony export */   "StandardEvents": () => (/* binding */ StandardEvents)
/* harmony export */ });
/** Name of the feature. */
const StandardEvents = 'standard:events';
/**
 * @deprecated Use {@link StandardEvents} instead.
 *
 * @group Deprecated
 */
const Events = StandardEvents;
//# sourceMappingURL=events.js.map

/***/ }),

/***/ "./node_modules/pony-cause/index.mjs":
/*!*******************************************!*\
  !*** ./node_modules/pony-cause/index.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorWithCause": () => (/* reexport safe */ _lib_error_with_cause_mjs__WEBPACK_IMPORTED_MODULE_0__.ErrorWithCause),
/* harmony export */   "findCauseByReference": () => (/* reexport safe */ _lib_helpers_mjs__WEBPACK_IMPORTED_MODULE_1__.findCauseByReference),
/* harmony export */   "getErrorCause": () => (/* reexport safe */ _lib_helpers_mjs__WEBPACK_IMPORTED_MODULE_1__.getErrorCause),
/* harmony export */   "messageWithCauses": () => (/* reexport safe */ _lib_helpers_mjs__WEBPACK_IMPORTED_MODULE_1__.messageWithCauses),
/* harmony export */   "stackWithCauses": () => (/* reexport safe */ _lib_helpers_mjs__WEBPACK_IMPORTED_MODULE_1__.stackWithCauses)
/* harmony export */ });
/* harmony import */ var _lib_error_with_cause_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/error-with-cause.mjs */ "./node_modules/pony-cause/lib/error-with-cause.mjs");
/* harmony import */ var _lib_helpers_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/helpers.mjs */ "./node_modules/pony-cause/lib/helpers.mjs");







/***/ }),

/***/ "./node_modules/pony-cause/lib/error-with-cause.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/pony-cause/lib/error-with-cause.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorWithCause": () => (/* binding */ ErrorWithCause)
/* harmony export */ });


/** @template [T=undefined] */
class ErrorWithCause extends Error {
  /**
   * @param {string} message
   * @param {{ cause?: T }} options
   */
  constructor (message, { cause } = {}) {
    super(message);

    /** @type {string} */
    this.name = ErrorWithCause.name;
    if (cause) {
      /** @type {T} */
      this.cause = cause;
    }
    /** @type {string} */
    this.message = message;
  }
}


/***/ }),

/***/ "./node_modules/pony-cause/lib/helpers.mjs":
/*!*************************************************!*\
  !*** ./node_modules/pony-cause/lib/helpers.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "findCauseByReference": () => (/* binding */ findCauseByReference),
/* harmony export */   "getErrorCause": () => (/* binding */ getErrorCause),
/* harmony export */   "messageWithCauses": () => (/* binding */ messageWithCauses),
/* harmony export */   "stackWithCauses": () => (/* binding */ stackWithCauses)
/* harmony export */ });


/**
 * @template {Error} T
 * @param {unknown} err
 * @param {new(...args: any[]) => T} reference
 * @returns {T|undefined}
 */
const findCauseByReference = (err, reference) => {
  if (!err || !reference) return;
  if (!(err instanceof Error)) return;
  if (
    !(reference.prototype instanceof Error) &&
    // @ts-ignore
    reference !== Error
  ) return;

  /**
   * Ensures we don't go circular
   *
   * @type {Set<Error>}
   */
  const seen = new Set();

  /** @type {Error|undefined} */
  let currentErr = err;

  while (currentErr && !seen.has(currentErr)) {
    seen.add(currentErr);

    if (currentErr instanceof reference) {
      return currentErr;
    }

    currentErr = getErrorCause(currentErr);
  }
};

/**
 * @param {Error|{ cause?: unknown|(()=>err)}} err
 * @returns {Error|undefined}
 */
const getErrorCause = (err) => {
  if (!err || typeof err !== 'object' || !('cause' in err)) {
    return;
  }

  // VError / NError style causes
  if (typeof err.cause === 'function') {
    const causeResult = err.cause();

    return causeResult instanceof Error
      ? causeResult
      : undefined;
  } else {
    return err.cause instanceof Error
      ? err.cause
      : undefined;
  }
};

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @returns {string}
 */
const _stackWithCauses = (err, seen) => {
  if (!(err instanceof Error)) return '';

  const stack = err.stack || '';

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return stack + '\ncauses have become circular...';
  }

  const cause = getErrorCause(err);

  // TODO: Follow up in https://github.com/nodejs/node/issues/38725#issuecomment-920309092 on how to log stuff

  if (cause) {
    seen.add(err);
    return (stack + '\ncaused by: ' + _stackWithCauses(cause, seen));
  } else {
    return stack;
  }
};

/**
 * @param {Error} err
 * @returns {string}
 */
const stackWithCauses = (err) => _stackWithCauses(err, new Set());

/**
 * Internal method that keeps a track of which error we have already added, to avoid circular recursion
 *
 * @private
 * @param {Error} err
 * @param {Set<Error>} seen
 * @param {boolean} [skip]
 * @returns {string}
 */
const _messageWithCauses = (err, seen, skip) => {
  if (!(err instanceof Error)) return '';

  const message = skip ? '' : (err.message || '');

  // Ensure we don't go circular or crazily deep
  if (seen.has(err)) {
    return message + ': ...';
  }

  const cause = getErrorCause(err);

  if (cause) {
    seen.add(err);

    const skipIfVErrorStyleCause = 'cause' in err && typeof err.cause === 'function';

    return (message +
      (skipIfVErrorStyleCause ? '' : ': ') +
      _messageWithCauses(cause, seen, skipIfVErrorStyleCause));
  } else {
    return message;
  }
};

/**
 * @param {Error} err
 * @returns {string}
 */
const messageWithCauses = (err) => _messageWithCauses(err, new Set());


/***/ }),

/***/ "./node_modules/zod/lib/index.mjs":
/*!****************************************!*\
  !*** ./node_modules/zod/lib/index.mjs ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BRAND": () => (/* binding */ BRAND),
/* harmony export */   "DIRTY": () => (/* binding */ DIRTY),
/* harmony export */   "EMPTY_PATH": () => (/* binding */ EMPTY_PATH),
/* harmony export */   "INVALID": () => (/* binding */ INVALID),
/* harmony export */   "NEVER": () => (/* binding */ NEVER),
/* harmony export */   "OK": () => (/* binding */ OK),
/* harmony export */   "ParseStatus": () => (/* binding */ ParseStatus),
/* harmony export */   "Schema": () => (/* binding */ ZodType),
/* harmony export */   "ZodAny": () => (/* binding */ ZodAny),
/* harmony export */   "ZodArray": () => (/* binding */ ZodArray),
/* harmony export */   "ZodBigInt": () => (/* binding */ ZodBigInt),
/* harmony export */   "ZodBoolean": () => (/* binding */ ZodBoolean),
/* harmony export */   "ZodBranded": () => (/* binding */ ZodBranded),
/* harmony export */   "ZodCatch": () => (/* binding */ ZodCatch),
/* harmony export */   "ZodDate": () => (/* binding */ ZodDate),
/* harmony export */   "ZodDefault": () => (/* binding */ ZodDefault),
/* harmony export */   "ZodDiscriminatedUnion": () => (/* binding */ ZodDiscriminatedUnion),
/* harmony export */   "ZodEffects": () => (/* binding */ ZodEffects),
/* harmony export */   "ZodEnum": () => (/* binding */ ZodEnum),
/* harmony export */   "ZodError": () => (/* binding */ ZodError),
/* harmony export */   "ZodFirstPartyTypeKind": () => (/* binding */ ZodFirstPartyTypeKind),
/* harmony export */   "ZodFunction": () => (/* binding */ ZodFunction),
/* harmony export */   "ZodIntersection": () => (/* binding */ ZodIntersection),
/* harmony export */   "ZodIssueCode": () => (/* binding */ ZodIssueCode),
/* harmony export */   "ZodLazy": () => (/* binding */ ZodLazy),
/* harmony export */   "ZodLiteral": () => (/* binding */ ZodLiteral),
/* harmony export */   "ZodMap": () => (/* binding */ ZodMap),
/* harmony export */   "ZodNaN": () => (/* binding */ ZodNaN),
/* harmony export */   "ZodNativeEnum": () => (/* binding */ ZodNativeEnum),
/* harmony export */   "ZodNever": () => (/* binding */ ZodNever),
/* harmony export */   "ZodNull": () => (/* binding */ ZodNull),
/* harmony export */   "ZodNullable": () => (/* binding */ ZodNullable),
/* harmony export */   "ZodNumber": () => (/* binding */ ZodNumber),
/* harmony export */   "ZodObject": () => (/* binding */ ZodObject),
/* harmony export */   "ZodOptional": () => (/* binding */ ZodOptional),
/* harmony export */   "ZodParsedType": () => (/* binding */ ZodParsedType),
/* harmony export */   "ZodPipeline": () => (/* binding */ ZodPipeline),
/* harmony export */   "ZodPromise": () => (/* binding */ ZodPromise),
/* harmony export */   "ZodReadonly": () => (/* binding */ ZodReadonly),
/* harmony export */   "ZodRecord": () => (/* binding */ ZodRecord),
/* harmony export */   "ZodSchema": () => (/* binding */ ZodType),
/* harmony export */   "ZodSet": () => (/* binding */ ZodSet),
/* harmony export */   "ZodString": () => (/* binding */ ZodString),
/* harmony export */   "ZodSymbol": () => (/* binding */ ZodSymbol),
/* harmony export */   "ZodTransformer": () => (/* binding */ ZodEffects),
/* harmony export */   "ZodTuple": () => (/* binding */ ZodTuple),
/* harmony export */   "ZodType": () => (/* binding */ ZodType),
/* harmony export */   "ZodUndefined": () => (/* binding */ ZodUndefined),
/* harmony export */   "ZodUnion": () => (/* binding */ ZodUnion),
/* harmony export */   "ZodUnknown": () => (/* binding */ ZodUnknown),
/* harmony export */   "ZodVoid": () => (/* binding */ ZodVoid),
/* harmony export */   "addIssueToContext": () => (/* binding */ addIssueToContext),
/* harmony export */   "any": () => (/* binding */ anyType),
/* harmony export */   "array": () => (/* binding */ arrayType),
/* harmony export */   "bigint": () => (/* binding */ bigIntType),
/* harmony export */   "boolean": () => (/* binding */ booleanType),
/* harmony export */   "coerce": () => (/* binding */ coerce),
/* harmony export */   "custom": () => (/* binding */ custom),
/* harmony export */   "date": () => (/* binding */ dateType),
/* harmony export */   "datetimeRegex": () => (/* binding */ datetimeRegex),
/* harmony export */   "default": () => (/* binding */ z),
/* harmony export */   "defaultErrorMap": () => (/* binding */ errorMap),
/* harmony export */   "discriminatedUnion": () => (/* binding */ discriminatedUnionType),
/* harmony export */   "effect": () => (/* binding */ effectsType),
/* harmony export */   "enum": () => (/* binding */ enumType),
/* harmony export */   "function": () => (/* binding */ functionType),
/* harmony export */   "getErrorMap": () => (/* binding */ getErrorMap),
/* harmony export */   "getParsedType": () => (/* binding */ getParsedType),
/* harmony export */   "instanceof": () => (/* binding */ instanceOfType),
/* harmony export */   "intersection": () => (/* binding */ intersectionType),
/* harmony export */   "isAborted": () => (/* binding */ isAborted),
/* harmony export */   "isAsync": () => (/* binding */ isAsync),
/* harmony export */   "isDirty": () => (/* binding */ isDirty),
/* harmony export */   "isValid": () => (/* binding */ isValid),
/* harmony export */   "late": () => (/* binding */ late),
/* harmony export */   "lazy": () => (/* binding */ lazyType),
/* harmony export */   "literal": () => (/* binding */ literalType),
/* harmony export */   "makeIssue": () => (/* binding */ makeIssue),
/* harmony export */   "map": () => (/* binding */ mapType),
/* harmony export */   "nan": () => (/* binding */ nanType),
/* harmony export */   "nativeEnum": () => (/* binding */ nativeEnumType),
/* harmony export */   "never": () => (/* binding */ neverType),
/* harmony export */   "null": () => (/* binding */ nullType),
/* harmony export */   "nullable": () => (/* binding */ nullableType),
/* harmony export */   "number": () => (/* binding */ numberType),
/* harmony export */   "object": () => (/* binding */ objectType),
/* harmony export */   "objectUtil": () => (/* binding */ objectUtil),
/* harmony export */   "oboolean": () => (/* binding */ oboolean),
/* harmony export */   "onumber": () => (/* binding */ onumber),
/* harmony export */   "optional": () => (/* binding */ optionalType),
/* harmony export */   "ostring": () => (/* binding */ ostring),
/* harmony export */   "pipeline": () => (/* binding */ pipelineType),
/* harmony export */   "preprocess": () => (/* binding */ preprocessType),
/* harmony export */   "promise": () => (/* binding */ promiseType),
/* harmony export */   "quotelessJson": () => (/* binding */ quotelessJson),
/* harmony export */   "record": () => (/* binding */ recordType),
/* harmony export */   "set": () => (/* binding */ setType),
/* harmony export */   "setErrorMap": () => (/* binding */ setErrorMap),
/* harmony export */   "strictObject": () => (/* binding */ strictObjectType),
/* harmony export */   "string": () => (/* binding */ stringType),
/* harmony export */   "symbol": () => (/* binding */ symbolType),
/* harmony export */   "transformer": () => (/* binding */ effectsType),
/* harmony export */   "tuple": () => (/* binding */ tupleType),
/* harmony export */   "undefined": () => (/* binding */ undefinedType),
/* harmony export */   "union": () => (/* binding */ unionType),
/* harmony export */   "unknown": () => (/* binding */ unknownType),
/* harmony export */   "util": () => (/* binding */ util),
/* harmony export */   "void": () => (/* binding */ voidType),
/* harmony export */   "z": () => (/* binding */ z)
/* harmony export */ });
var util;
(function (util) {
    util.assertEqual = (val) => val;
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array
            .map((val) => (typeof val === "string" ? `'${val}'` : val))
            .join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (util = {}));
var objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "symbol":
            return ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then &&
                typeof data.then === "function" &&
                data.catch &&
                typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};

const ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    get errors() {
        return this.issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    static assert(value) {
        if (!(value instanceof ZodError)) {
            throw new Error(`Not a ZodError: ${value}`);
        }
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};

const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
            break;
        case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
            break;
        case ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
            break;
        case ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    util.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.custom:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            util.assertNever(issue);
    }
    return { message };
};

let overrideErrorMap = errorMap;
function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}

const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    if (issueData.message !== undefined) {
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message,
        };
    }
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: errorMessage,
    };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            overrideMap,
            overrideMap === errorMap ? undefined : errorMap, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
                key,
                value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return INVALID;
            if (value.status === "aborted")
                return INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (key.value !== "__proto__" &&
                (typeof value.value !== "undefined" || pair.alwaysSet)) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
const INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));

var _ZodEnum_cache, _ZodNativeEnum_cache;
class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (this._key instanceof Array) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if (isValid(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        var _a, _b;
        const { message } = params;
        if (iss.code === "invalid_enum_value") {
            return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
        }
        if (typeof ctx.data === "undefined") {
            return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
        }
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
    }
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new ParseStatus(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: getParsedType(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        var _a;
        const ctx = {
            common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                async: true,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult)
            ? maybeAsyncResult
            : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodIssueCode.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function"
                    ? refinementData(val, ctx)
                    : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this, this._def);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    readonly() {
        return ZodReadonly.create(this);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
// const uuidRegex =
//   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
// const emailRegex =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// const emailRegex =
//   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// const emailRegex =
//   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
// const emailRegex =
//   /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
// faster, simpler, safer
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
// simple
// const dateRegexSource = `\\d{4}-\\d{2}-\\d{2}`;
// no leap year validation
// const dateRegexSource = `\\d{4}-((0[13578]|10|12)-31|(0[13-9]|1[0-2])-30|(0[1-9]|1[0-2])-(0[1-9]|1\\d|2\\d))`;
// with leap year validation
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
    // let regex = `\\d{2}:\\d{2}:\\d{2}`;
    let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
    if (args.precision) {
        regex = `${regex}\\.\\d{${args.precision}}`;
    }
    else if (args.precision == null) {
        regex = `${regex}(\\.\\d+)?`;
    }
    return regex;
}
function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
        opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.string,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "email",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex) {
                    emojiRegex = new RegExp(_emojiRegex, "u");
                }
                if (!emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "emoji",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "uuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "nanoid") {
                if (!nanoidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "nanoid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid2",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ulid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch (_a) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "url",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "regex",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "date") {
                const regex = dateRegex;
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "date",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "time") {
                const regex = timeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "time",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "duration") {
                if (!durationRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "duration",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ip",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "base64") {
                if (!base64Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "base64",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
            validation,
            code: ZodIssueCode.invalid_string,
            ...errorUtil.errToObj(message),
        });
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
        var _a, _b;
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                local: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
            local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    date(message) {
        return this._addCheck({ kind: "date", message });
    }
    time(options) {
        if (typeof options === "string") {
            return this._addCheck({
                kind: "time",
                precision: null,
                message: options,
            });
        }
        return this._addCheck({
            kind: "time",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil.errToObj(message),
        });
    }
    /**
     * @deprecated Use z.string().min(1) instead.
     * @see {@link ZodString.min}
     */
    nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
    }
    toLowerCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
    }
    toUpperCase() {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodString.create = (params) => {
    var _a;
    return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / Math.pow(10, decCount);
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.number,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" ||
            (ch.kind === "multipleOf" && util.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" ||
                ch.kind === "int" ||
                ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.bigint,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.boolean,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.date,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_date,
            });
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.symbol,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.undefined,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.null,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.never,
            received: ctx.parsedType,
        });
        return INVALID;
    }
}
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.void,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                addIssueToContext(ctx, {
                    code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return ParseStatus.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        return (this._cached = { shape, keys });
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever &&
            this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") ;
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    syncPairs.push({
                        key,
                        value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return ParseStatus.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        var _a, _b, _c, _d;
                        const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        util.objectKeys(mask).forEach((key) => {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util.objectKeys(this.shape));
    }
}
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError(issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
    }
    get options() {
        return this._def.options;
    }
}
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return util.objectValues(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else if (type instanceof ZodOptional) {
        return [undefined, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
    }
    else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
    }
    else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
    }
    else {
        return [];
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues.length) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
        const bKeys = util.objectKeys(b);
        const sharedKeys = util
            .objectKeys(a)
            .filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === ZodParsedType.date &&
        bType === ZodParsedType.date &&
        +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                return INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_intersection_types,
                });
                return INVALID;
            }
            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return ParseStatus.mergeArray(status, results);
            });
        }
        else {
            return ParseStatus.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (ctx.common.async) {
            return ParseStatus.mergeObjectAsync(status, pairs);
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
class ZodMap extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.map,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.set,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return INVALID;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.function,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        function makeArgsIssue(args, error) {
            return makeIssue({
                data: args,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return makeIssue({
                data: returns,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(async function (...args) {
                const error = new ZodError([]);
                const parsedArgs = await me._def.args
                    .parseAsync(args, params)
                    .catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await Reflect.apply(fn, this, parsedArgs);
                const parsedReturns = await me._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            // Would love a way to avoid disabling this rule, but we need
            // an alias (using an arrow function was what caused 2651).
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const me = this;
            return OK(function (...args) {
                const parsedArgs = me._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = Reflect.apply(fn, this, parsedArgs.data);
                const parsedReturns = me._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args
                ? args
                : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_literal,
                expected: this._def.value,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodEnum_cache.set(this, void 0);
    }
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values, newDef = this._def) {
        return ZodEnum.create(values, {
            ...this._def,
            ...newDef,
        });
    }
    exclude(values, newDef = this._def) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
            ...this._def,
            ...newDef,
        });
    }
}
_ZodEnum_cache = new WeakMap();
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    constructor() {
        super(...arguments);
        _ZodNativeEnum_cache.set(this, void 0);
    }
    _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string &&
            ctx.parsedType !== ZodParsedType.number) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
            __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
        }
        if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
_ZodNativeEnum_cache = new WeakMap();
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise &&
            ctx.common.async === false) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.promise,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise
            ? ctx.data
            : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
            addIssue: (arg) => {
                addIssueToContext(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data, checkCtx);
            if (ctx.common.async) {
                return Promise.resolve(processed).then(async (processed) => {
                    if (status.value === "aborted")
                        return INVALID;
                    const result = await this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (result.status === "aborted")
                        return INVALID;
                    if (result.status === "dirty")
                        return DIRTY(result.value);
                    if (status.value === "dirty")
                        return DIRTY(result.value);
                    return result;
                });
            }
            else {
                if (status.value === "aborted")
                    return INVALID;
                const result = this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
                if (result.status === "aborted")
                    return INVALID;
                if (result.status === "dirty")
                    return DIRTY(result.value);
                if (status.value === "dirty")
                    return DIRTY(result.value);
                return result;
            }
        }
        if (effect.type === "refinement") {
            const executeRefinement = (acc) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return INVALID;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((inner) => {
                    if (inner.status === "aborted")
                        return INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!isValid(base))
                    return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((base) => {
                    if (!isValid(base))
                        return base;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
                });
            }
        }
        util.assertNever(effect);
    }
}
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};
class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
            return OK(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
            return OK(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function"
            ? params.default
            : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if (isAsync(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.nan,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
}
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return DIRTY(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return INVALID;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
class ZodReadonly extends ZodType {
    _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
            if (isValid(data)) {
                data.value = Object.freeze(data.value);
            }
            return data;
        };
        return isAsync(result)
            ? result.then((data) => freeze(data))
            : freeze(result);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params),
    });
};
function custom(check, params = {}, 
/**
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            var _a, _b;
            if (!check(data)) {
                const p = typeof params === "function"
                    ? params(data)
                    : typeof params === "string"
                        ? { message: params }
                        : params;
                const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                const p2 = typeof p === "string" ? { message: p } : p;
                ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
            }
        });
    return ZodAny.create();
}
const late = {
    object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
};
const NEVER = INVALID;

var z = /*#__PURE__*/Object.freeze({
    __proto__: null,
    defaultErrorMap: errorMap,
    setErrorMap: setErrorMap,
    getErrorMap: getErrorMap,
    makeIssue: makeIssue,
    EMPTY_PATH: EMPTY_PATH,
    addIssueToContext: addIssueToContext,
    ParseStatus: ParseStatus,
    INVALID: INVALID,
    DIRTY: DIRTY,
    OK: OK,
    isAborted: isAborted,
    isDirty: isDirty,
    isValid: isValid,
    isAsync: isAsync,
    get util () { return util; },
    get objectUtil () { return objectUtil; },
    ZodParsedType: ZodParsedType,
    getParsedType: getParsedType,
    ZodType: ZodType,
    datetimeRegex: datetimeRegex,
    ZodString: ZodString,
    ZodNumber: ZodNumber,
    ZodBigInt: ZodBigInt,
    ZodBoolean: ZodBoolean,
    ZodDate: ZodDate,
    ZodSymbol: ZodSymbol,
    ZodUndefined: ZodUndefined,
    ZodNull: ZodNull,
    ZodAny: ZodAny,
    ZodUnknown: ZodUnknown,
    ZodNever: ZodNever,
    ZodVoid: ZodVoid,
    ZodArray: ZodArray,
    ZodObject: ZodObject,
    ZodUnion: ZodUnion,
    ZodDiscriminatedUnion: ZodDiscriminatedUnion,
    ZodIntersection: ZodIntersection,
    ZodTuple: ZodTuple,
    ZodRecord: ZodRecord,
    ZodMap: ZodMap,
    ZodSet: ZodSet,
    ZodFunction: ZodFunction,
    ZodLazy: ZodLazy,
    ZodLiteral: ZodLiteral,
    ZodEnum: ZodEnum,
    ZodNativeEnum: ZodNativeEnum,
    ZodPromise: ZodPromise,
    ZodEffects: ZodEffects,
    ZodTransformer: ZodEffects,
    ZodOptional: ZodOptional,
    ZodNullable: ZodNullable,
    ZodDefault: ZodDefault,
    ZodCatch: ZodCatch,
    ZodNaN: ZodNaN,
    BRAND: BRAND,
    ZodBranded: ZodBranded,
    ZodPipeline: ZodPipeline,
    ZodReadonly: ZodReadonly,
    custom: custom,
    Schema: ZodType,
    ZodSchema: ZodType,
    late: late,
    get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
    coerce: coerce,
    any: anyType,
    array: arrayType,
    bigint: bigIntType,
    boolean: booleanType,
    date: dateType,
    discriminatedUnion: discriminatedUnionType,
    effect: effectsType,
    'enum': enumType,
    'function': functionType,
    'instanceof': instanceOfType,
    intersection: intersectionType,
    lazy: lazyType,
    literal: literalType,
    map: mapType,
    nan: nanType,
    nativeEnum: nativeEnumType,
    never: neverType,
    'null': nullType,
    nullable: nullableType,
    number: numberType,
    object: objectType,
    oboolean: oboolean,
    onumber: onumber,
    optional: optionalType,
    ostring: ostring,
    pipeline: pipelineType,
    preprocess: preprocessType,
    promise: promiseType,
    record: recordType,
    set: setType,
    strictObject: strictObjectType,
    string: stringType,
    symbol: symbolType,
    transformer: effectsType,
    tuple: tupleType,
    'undefined': undefinedType,
    union: unionType,
    unknown: unknownType,
    'void': voidType,
    NEVER: NEVER,
    ZodIssueCode: ZodIssueCode,
    quotelessJson: quotelessJson,
    ZodError: ZodError
});




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/inpage.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _background_providers_initializeInpageProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background/providers/initializeInpageProvider */ "./src/background/providers/initializeInpageProvider.ts");
/* harmony import */ var _background_providers_utils_onPageActivated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./background/providers/utils/onPageActivated */ "./src/background/providers/utils/onPageActivated.ts");
/* harmony import */ var _background_utils_messaging_AutoPairingPostMessageConnection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./background/utils/messaging/AutoPairingPostMessageConnection */ "./src/background/utils/messaging/AutoPairingPostMessageConnection.ts");



const shouldInjectProvider = () => {
  return doctypeCheck() && suffixCheck() && documentElementCheck();
};

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} if the doctype is html or if none exists
 */
const doctypeCheck = () => {
  const {
    doctype
  } = window.document;
  if (doctype) {
    return doctype.name === 'html';
  }
  return true;
};

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} whether or not the extension of the current document is prohibited
 */
const suffixCheck = () => {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u];
  const currentUrl = window.location.pathname;
  for (let i = 0; i < prohibitedTypes.length; i++) {
    if (prohibitedTypes[i]?.test(currentUrl)) {
      return false;
    }
  }
  return true;
};

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} if the documentElement is an html node or if none exists
 */
const documentElementCheck = () => {
  const documentElement = document.documentElement.nodeName;
  if (documentElement) {
    return documentElement.toLowerCase() === 'html';
  }
  return true;
};
const connection = new _background_utils_messaging_AutoPairingPostMessageConnection__WEBPACK_IMPORTED_MODULE_2__["default"](false);
if (shouldInjectProvider()) {
  (0,_background_providers_utils_onPageActivated__WEBPACK_IMPORTED_MODULE_1__["default"])(() => (0,_background_providers_initializeInpageProvider__WEBPACK_IMPORTED_MODULE_0__.initializeProvider)(connection));
}
})();

/******/ })()
;