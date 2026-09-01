/** @type {import('jest').Config} */
module.exports = {
  ...require('../../src/tests/coverageConfig.cjs'),
  clearMocks: true,
  testEnvironment: 'node',
  transform: {},
  testMatch: ['<rootDir>/src/**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
