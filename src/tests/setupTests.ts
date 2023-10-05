import 'reflect-metadata';
import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

// polyfill TextEncoder till it's supported in jsdom
// https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

Object.defineProperties(global.crypto, {
  randomUUID: {
    value: jest.fn().mockReturnValue('00000000-0000-0000-0000-000000000000'),
  },
  getRandomValues: {
    value: (arr) => arr.map(() => 1),
  },
});

Object.defineProperty(global.document, 'prerendering', {
  writable: true,
  configurable: true,
  value: false,
});

global.chrome = {
  runtime: {
    id: 'testid',
    getManifest: () => ({ manifest_version: 3 }),
  },
  windows: {
    onRemoved: {
      addListener: jest.fn(),
    },
    onFocusChanged: {
      addListener: jest.fn(),
    },
  },
  i18n: {
    getMessage(key: string) {
      switch (key) {
        case 'appName':
          return 'Core Test';
        case 'appDesc':
          return 'Test way to Connect with Crypto';
        default:
          // We'll throw an error here to make sure the new keys are added
          // within manifest/_locales/**/messages.json files.

          // If you're seeing this error even though you added the key
          // to the JSON files, please make sure to also mock it in this switch
          // block here.
          throw 'Unknown message key used with i18n.getMessage() call.';
      }
    },
  },
} as any;
