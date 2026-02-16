import { ErrorCode, SdkError } from '@avalabs/unified-asset-transfer';

import {
  isGasEstimationError,
  isInvalidResponseError,
  shouldRetryWithNextQuote,
} from './swapErrors';

const gasEstimationError = new SdkError(
  'Error during gas estimation',
  ErrorCode.VIEM_ERROR,
);
const quoteExpiredError = new SdkError(
  'Quote expired',
  ErrorCode.INVALID_PARAMS,
);
const invalidResponseError = new Error('Response validation failed');
const otherError = new Error('Other error');
const otherSdkError = new SdkError('Other error', ErrorCode.VIEM_ERROR);

describe('isGasEstimationError', () => {
  it('verifies if the error is a gas estimation error', () => {
    expect(isGasEstimationError(gasEstimationError)).toBe(true);
    expect(isGasEstimationError(quoteExpiredError)).toBe(false);
    expect(isGasEstimationError(otherError)).toBe(false);
    expect(isGasEstimationError(otherSdkError)).toBe(false);
    expect(isGasEstimationError(invalidResponseError)).toBe(false);
  });
});

describe('isInvalidResponseError', () => {
  it('verifies if the error is a invalid response error', () => {
    expect(isInvalidResponseError(invalidResponseError)).toBe(true);
    expect(isInvalidResponseError(gasEstimationError)).toBe(false);
    expect(isInvalidResponseError(quoteExpiredError)).toBe(false);
    expect(isInvalidResponseError(otherError)).toBe(false);
    expect(isInvalidResponseError(otherSdkError)).toBe(false);
  });
});

describe('shouldRetryWithNextQuote', () => {
  it('verifies if the error is a gas estimation error', () => {
    expect(shouldRetryWithNextQuote(gasEstimationError)).toBe(true);
    expect(shouldRetryWithNextQuote(invalidResponseError)).toBe(true);
    expect(shouldRetryWithNextQuote(quoteExpiredError)).toBe(false);
    expect(shouldRetryWithNextQuote(otherError)).toBe(false);
    expect(shouldRetryWithNextQuote(otherSdkError)).toBe(false);
  });
});
