import 'reflect-metadata';

global.chrome = {
  runtime: {
    id: 'testid',
    getManifest: () => ({ manifest_version: 3 }),
  },
} as any;
