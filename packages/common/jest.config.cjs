/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  resolver: '<rootDir>/../../src/tests/resolver.js',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/../../src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@shared/(.*)': '<rootDir>/../../src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
