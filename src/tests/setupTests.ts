import 'reflect-metadata';
import { TextDecoder } from 'util';
import { jest } from '@jest/globals';
import { MockTextEncoder } from './MockTextEncoder';
import crypto from 'node:crypto';

// @lombard.finance/sdk (transitive dep of @avalabs/bridge-unified) attempts a
// dynamic import that fails in Jest's VM without --experimental-vm-modules.
// The error is caught internally but logged to console.error on every test
// suite that transitively loads bridge-unified.
const _consoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Failed to initialize bitcoinjs-lib ECC library')
  ) {
    return;
  }
  _consoleError(...args);
};

// polyfill TextEncoder till it's supported in jsdom
// https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = MockTextEncoder;
global.TextDecoder = TextDecoder as any;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.AbortSignal = {
  timeout(ms: number) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('TimeoutError')), ms);
    return controller.signal;
  },
};

Object.defineProperties(global.crypto, {
  randomUUID: {
    value: jest.fn().mockReturnValue('00000000-0000-0000-0000-000000000000'),
  },
  getRandomValues: {
    value: (arr) => arr.map(() => 1),
  },
  subtle: {
    value: crypto.subtle,
  },
});

Object.defineProperty(global.document, 'prerendering', {
  writable: true,
  configurable: true,
  value: false,
});

Object.defineProperties(global.performance, {
  mark: {
    value: jest.fn(),
  },
  measure: {
    value: jest.fn().mockReturnValue({ duration: 100 }),
  },
  clearMarks: {
    value: jest.fn(),
  },
  clearMeasures: {
    value: jest.fn(),
  },
});

global.chrome = {
  runtime: {
    id: 'testid',
    getPlatformInfo: () => ({
      os: 'mac',
      arch: 'arm',
    }),
    getManifest: () => ({
      manifest_version: 3,
      version: '0.0.0',
    }),
    getURL: (path: string) => path,
  },
  notifications: {
    create: jest.fn(),
  },
  windows: {
    onRemoved: {
      addListener: jest.fn(),
    },
    onFocusChanged: {
      addListener: jest.fn(),
    },
    getCurrent: () => {},
  },
  sidePanel: {
    onOpened: {
      addListener: () => {},
      removeListener: () => {},
    },
    onClosed: {
      addListener: () => {},
      removeListener: () => {},
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
