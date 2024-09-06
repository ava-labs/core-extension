/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  resolver: '<rootDir>/src/tests/resolver.js',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@src/(.*)': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!micro-eth-signer)`],
  globals: {
    EVM_PROVIDER_INFO_NAME: 'EVM_PROVIDER_INFO_NAME',
    EVM_PROVIDER_INFO_UUID: 'EVM_PROVIDER_INFO_UUID',
    EVM_PROVIDER_INFO_ICON: 'EVM_PROVIDER_INFO_ICON',
    EVM_PROVIDER_INFO_DESCRIPTION: 'EVM_PROVIDER_INFO_DESCRIPTION',
    EVM_PROVIDER_INFO_RDNS: 'EVM_PROVIDER_INFO_RDNS',
  },
};
