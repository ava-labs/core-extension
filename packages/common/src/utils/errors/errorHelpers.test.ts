import { EthereumRpcError, ethErrors } from 'eth-rpc-errors';
import { CommonError, SwapErrorCode } from '@core/types';
import {
  isWrappedError,
  wrapError,
  isUserRejectionError,
  isMissingBtcWalletPolicyError,
  isSwapTxBuildError,
  isGasEstimationError,
} from './errorHelpers';

describe('src/utils/errors/errorHelpers', () => {
  describe('#isWrappedError', () => {
    it('recognizes wrapped RPC errors', () => {
      expect(
        isWrappedError(
          ethErrors.rpc.internal({ data: { someProp: 'someValue' } }),
        ),
      ).toBe(false);
      expect(
        isWrappedError(
          ethErrors.rpc.internal({
            data: { reason: CommonError.UserRejected },
          }),
        ),
      ).toBe(true);
    });
  });

  describe('#wrapError', () => {
    it('propagates wrapped errors without changing them', async () => {
      const wrappedErr = ethErrors.rpc.transactionRejected({
        data: {
          reason: 1337,
        },
      });

      try {
        await Promise.reject(wrappedErr).catch(wrapError());
      } catch (err: any) {
        expect(err).toStrictEqual(wrappedErr);
      }
    });

    it('wraps other errors into Unknown errors', async () => {
      const otherErr = new Error('He he he');

      try {
        await Promise.reject(otherErr).catch(wrapError());
      } catch (err: any) {
        expect(err).toBeInstanceOf(EthereumRpcError);
        expect(err.data).toEqual({
          reason: CommonError.Unknown,
          originalError: otherErr,
        });
      }
    });

    it('falls back straight to provided error if it was already wrapped', async () => {
      const networkErr = ethErrors.rpc.internal({
        data: {
          reason: CommonError.NetworkError,
        },
      });

      try {
        await Promise.reject('Ooopsies!').catch(wrapError(networkErr));
      } catch (err: any) {
        expect(err).toStrictEqual(networkErr);
      }
    });

    it('if provided, uses the fallback error as original error', async () => {
      const networkErr = 'Network failure, sorry';

      try {
        await Promise.reject('Ooopsies!').catch(wrapError(networkErr));
      } catch (err: any) {
        expect(err).toBeInstanceOf(EthereumRpcError);
        expect(err.data).toEqual({
          reason: CommonError.Unknown,
          originalError: networkErr,
        });
      }

      try {
        await Promise.reject('Ooopsies!').catch(wrapError());
      } catch (err: any) {
        expect(err).toBeInstanceOf(EthereumRpcError);
        expect(err.data).toEqual({
          reason: CommonError.Unknown,
          originalError: 'Ooopsies!',
        });
      }
    });

    it('falls back to unknown error with originalError set', async () => {
      try {
        await Promise.reject('Ooopsies!').catch(wrapError());
      } catch (err: any) {
        expect(err).toBeInstanceOf(EthereumRpcError);
        expect(err.data).toEqual({
          reason: CommonError.Unknown,
          originalError: 'Ooopsies!',
        });
      }
    });
  });

  describe('#isUserRejectionError', () => {
    it('returns false for null or undefined inputs', () => {
      expect(isUserRejectionError(null)).toBe(false);
      expect(isUserRejectionError(undefined)).toBe(false);
    });

    it('returns false for non-object inputs', () => {
      expect(isUserRejectionError('string')).toBe(false);
      expect(isUserRejectionError(123)).toBe(false);
      expect(isUserRejectionError(true)).toBe(false);
    });

    describe('Ledger cases', () => {
      const statusError = (statusCode: number) =>
        Object.assign(
          new Error(`Ledger device: status 0x${statusCode.toString(16)}`),
          { name: 'TransportStatusError', statusCode },
        );

      it.each([
        ['USER_REFUSED_ON_DEVICE', 0x5501],
        ['CONDITIONS_OF_USE_NOT_SATISFIED', 0x6985],
        ['the Avalanche app "Command not allowed"', 0x6986],
      ])('returns true for %s status code', (_, statusCode) => {
        expect(isUserRejectionError(statusError(statusCode))).toBe(true);
      });

      it('returns false for other Ledger status codes', () => {
        expect(isUserRejectionError(statusError(0x6a80))).toBe(false);
      });

      it('recognizes hw-app-avalanche DeviceActionError rejections', () => {
        class DeviceActionError extends Error {
          constructor(readonly statusCode: number) {
            super('Device action failed');
          }
        }

        expect(isUserRejectionError(new DeviceActionError(0x6985))).toBe(true);
      });

      it.each(['5501', '6985', '6986'])(
        'returns true for DMK errors with code %s',
        (errorCode) => {
          expect(
            isUserRejectionError({ _tag: 'EthAppCommandError', errorCode }),
          ).toBe(true);
        },
      );

      it.each(['RefusedByUserDAError', 'ActionRefusedError'])(
        'returns true for the DMK %s tag',
        (_tag) => {
          expect(isUserRejectionError({ _tag })).toBe(true);
        },
      );

      it('returns false for other DMK errors', () => {
        expect(
          isUserRejectionError({
            _tag: 'DeviceLockedError',
            errorCode: '5515',
          }),
        ).toBe(false);
      });
    });

    describe('Generic error object cases', () => {
      it('returns true for objects with code 4001', () => {
        const error = {
          code: 4001,
          message: 'User denied transaction signature',
        };
        expect(isUserRejectionError(error)).toBe(true);
      });

      it('returns true for objects with message starting with "User rejected"', () => {
        const error1 = { message: 'User rejected the request' };
        const error2 = { message: 'User rejected transaction' };
        const error3 = { message: 'User rejected signing' };

        expect(isUserRejectionError(error1)).toBe(true);
        expect(isUserRejectionError(error2)).toBe(true);
        expect(isUserRejectionError(error3)).toBe(true);
      });

      it('returns false for objects with messages that do not start with "User rejected"', () => {
        const error1 = { message: 'Something else happened' };
        const error2 = { message: 'The user rejected this' }; // doesn't start with "User rejected"
        const error3 = { message: 'Network error occurred' };

        expect(isUserRejectionError(error1)).toBe(false);
        expect(isUserRejectionError(error2)).toBe(false);
        expect(isUserRejectionError(error3)).toBe(false);
      });

      it('returns false for objects without code 4001 or rejection message', () => {
        const error1 = { code: 4000, message: 'Different error' };
        const error2 = { code: 5000, message: 'Another error' };
        const error3 = { message: 'Generic error message' };
        const error4 = { someOtherProp: 'value' };

        expect(isUserRejectionError(error1)).toBe(false);
        expect(isUserRejectionError(error2)).toBe(false);
        expect(isUserRejectionError(error3)).toBe(false);
        expect(isUserRejectionError(error4)).toBe(false);
      });

      it('handles objects with null or undefined message properties', () => {
        const error1 = { message: null };
        const error2 = { message: undefined };
        const error3 = { code: 4001, message: null };

        expect(isUserRejectionError(error1)).toBe(false);
        expect(isUserRejectionError(error2)).toBe(false);
        expect(isUserRejectionError(error3)).toBe(true); // code 4001 should still work
      });
    });

    describe('Edge cases', () => {
      it('handles empty objects', () => {
        expect(isUserRejectionError({})).toBe(false);
      });

      it('handles Error instances with rejection messages', () => {
        const error1 = new Error('User rejected the transaction');
        const error2 = new Error('Network timeout');

        expect(isUserRejectionError(error1)).toBe(true);
        expect(isUserRejectionError(error2)).toBe(false);
      });

      it('handles Error instances with code 4001', () => {
        const error = new Error('Some error');
        (error as any).code = 4001;

        expect(isUserRejectionError(error)).toBe(true);
      });
    });
  });

  describe('#isMissingBtcWalletPolicyError', () => {
    const POLICY_ERROR = 'Error while parsing wallet policy: missing data.';

    it('returns false for empty inputs', () => {
      expect(isMissingBtcWalletPolicyError(null)).toBe(false);
      expect(isMissingBtcWalletPolicyError(undefined)).toBe(false);
    });

    it('recognizes the error by its message', () => {
      expect(isMissingBtcWalletPolicyError(new Error(POLICY_ERROR))).toBe(true);
    });

    it('recognizes the error when wrapped as the original error', () => {
      expect(
        isMissingBtcWalletPolicyError(
          ethErrors.rpc.internal({
            data: { reason: CommonError.Unknown, originalError: POLICY_ERROR },
          }),
        ),
      ).toBe(true);
    });

    it('returns false for unrelated errors', () => {
      expect(isMissingBtcWalletPolicyError(new Error('Timeout'))).toBe(false);
      expect(isMissingBtcWalletPolicyError('not an object')).toBe(false);
    });
  });

  describe('#isSwapTxBuildError', () => {
    it('recognizes wrapped swap build errors', () => {
      expect(
        isSwapTxBuildError(
          ethErrors.rpc.internal({
            data: { reason: SwapErrorCode.CannotBuildTx },
          }),
        ),
      ).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isSwapTxBuildError(null)).toBe(false);
      expect(isSwapTxBuildError(new Error('Cannot build tx'))).toBe(false);
      expect(
        isSwapTxBuildError(
          ethErrors.rpc.internal({ data: { reason: CommonError.Unknown } }),
        ),
      ).toBe(false);
    });
  });

  describe('#isGasEstimationError', () => {
    it('recognizes wrapped gas estimation errors', () => {
      expect(
        isGasEstimationError(
          ethErrors.rpc.internal({
            data: { reason: CommonError.UnableToEstimateGas },
          }),
        ),
      ).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isGasEstimationError(undefined)).toBe(false);
      expect(isGasEstimationError(new Error('gas'))).toBe(false);
      expect(
        isGasEstimationError(
          ethErrors.rpc.internal({ data: { reason: CommonError.Unknown } }),
        ),
      ).toBe(false);
    });
  });
});
