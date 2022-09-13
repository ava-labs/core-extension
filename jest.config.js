/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  moduleNameMapper: {
    '^@src/(.*)': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
};
