import 'reflect-metadata';

global.crypto = {
  randomUUID: jest.fn().mockReturnValue('00000000-0000-0000-0000-000000000000'),
} as any;

global.chrome = {
  runtime: {
    id: 'testid',
    getManifest: () => ({ manifest_version: 3 }),
  },
} as any;
