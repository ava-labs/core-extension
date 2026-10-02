/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */

module.exports = {
  ...require('../../src/tests/coverageConfig.cjs'),
  clearMocks: true,
  preset: 'ts-jest',
  resolver: '<rootDir>/../../src/tests/resolver.js',
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: [
    '<rootDir>/../../src/tests/alignJestUint8ArrayWithNode.cjs',
    '<rootDir>/../../src/tests/mockClientApis.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/../../src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^@shared/(.*)': '<rootDir>/../../src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
    '^@avalabs/crypto-wasm$': '<rootDir>/../../src/tests/mocks/cryptoWasm.js',
    '^@ledgerhq/device-management-kit$':
      '<rootDir>/../../src/tests/mocks/ledgerDmk.js',
    '^@ledgerhq/device-transport-kit-web-hid$':
      '<rootDir>/../../src/tests/mocks/ledgerDmk.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!micro-eth-signer)`],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
