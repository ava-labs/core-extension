import { renderHook } from '@testing-library/react';
import { HttpError } from '@avalabs/fusion-sdk';

import { useErrorMessage } from './useErrorMessage';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
  })),
}));

const makeHttpError = (data: unknown) =>
  new HttpError(
    'HTTP 400 Bad Request',
    { status: 400, statusText: 'Bad Request' } as unknown as Response,
    data,
  );

describe('hooks/useErrorMessage', () => {
  const renderGetTranslatedError = () =>
    renderHook(() => useErrorMessage()).result.current;

  describe('HttpError', () => {
    it('surfaces the backend message from a `message` field', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(
        getTranslatedError(
          makeHttpError({
            message: 'Minimum execution time between orders is 300 seconds',
          }),
        ),
      ).toEqual({
        title: 'Minimum execution time between orders is 300 seconds',
      });
    });

    it('surfaces the backend message when the body is a plain string', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(getTranslatedError(makeHttpError('Something went wrong'))).toEqual(
        {
          title: 'Something went wrong',
        },
      );
    });

    it('surfaces the backend message from an `error` field', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(
        getTranslatedError(makeHttpError({ error: 'Invalid frequency' })),
      ).toEqual({ title: 'Invalid frequency' });
    });

    it('surfaces the backend message from a nested `error.message` field', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(
        getTranslatedError(
          makeHttpError({ error: { message: 'Nested reason' } }),
        ),
      ).toEqual({ title: 'Nested reason' });
    });

    it('trims surrounding whitespace from the backend message', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(
        getTranslatedError(makeHttpError({ message: '  Trimmed reason \n' })),
      ).toEqual({ title: 'Trimmed reason' });
    });

    it('falls back to the unknown error when the body has no usable message', () => {
      const getTranslatedError = renderGetTranslatedError();

      expect(getTranslatedError(makeHttpError(undefined))).toEqual({
        title: 'Unknown error',
      });
      expect(getTranslatedError(makeHttpError({ status: 400 }))).toEqual({
        title: 'Unknown error',
      });
      expect(getTranslatedError(makeHttpError({ message: '   ' }))).toEqual({
        title: 'Unknown error',
      });
    });
  });
});
