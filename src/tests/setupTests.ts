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
} as any;

const broadcastChannelMock: BroadcastChannel = {
  onmessage: null,
  postMessage: jest.fn(),
  name: '',
  onmessageerror: null,
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

global.BroadcastChannel = jest.fn<BroadcastChannel, string[]>(
  (name: string) => ({
    ...broadcastChannelMock,
    name,
  })
);
