import { EthereumRpcError, ethErrors } from 'eth-rpc-errors';
import { CommonError } from '@core/types';
import { isWrappedError, wrapError } from './errorHelpers';

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
});
