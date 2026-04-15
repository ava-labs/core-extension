'use strict';

const { Buffer } = require('node:buffer');

// jest-environment-jsdom sets `global` to the jsdom Window. Window.Uint8Array is
// not the same constructor Node's Buffer subclasses, so `buf instanceof Uint8Array`
// is false for valid Buffers. tiny-secp256k1 (via bip32) relies on that check.
global.Uint8Array = Object.getPrototypeOf(Buffer.prototype).constructor;
