/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  transform: {},
  testMatch: ['<rootDir>/src/**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
