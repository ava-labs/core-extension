/**
 * @avalabs/k2-alpine uses lodash-es which exports ES modules.
 * Jest can't parse ES modules by default, so we need to mock this library.
 */

export const toast = {
  pending: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  dismiss: jest.fn(),
};
