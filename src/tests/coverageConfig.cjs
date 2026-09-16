/**
 * Shared coverage settings for all workspace jest configs.
 *
 * collectCoverageFrom includes files never imported by any test, so
 * coverage reflects the whole package, not just the tested slice.
 * Coverage is only collected when jest runs with --coverage (CI),
 * so local `yarn test` speed is unaffected.
 */
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json-summary', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
