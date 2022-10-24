import 'reflect-metadata';
import { TextEncoder, TextDecoder } from 'util';

// polyfill TextEncoder till it's supported in jsdom
// https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

global.crypto = {
  randomUUID: jest.fn().mockReturnValue('00000000-0000-0000-0000-000000000000'),
  getRandomValues: (arr) => arr.map(() => 1),
} as any;

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
