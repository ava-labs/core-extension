/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  resolver: '<rootDir>/../../src/tests/resolver.js',
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/../../src/tests/mockClientApis.ts'],
  setupFilesAfterEnv: ['<rootDir>/../../src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
    '^@shared/(.*)': '<rootDir>/../../src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
    '^lodash-es$': require.resolve('lodash'),
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!micro-eth-signer)`],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
