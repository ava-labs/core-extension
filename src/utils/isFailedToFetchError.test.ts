import { isFailedToFetchError } from './isFailedToFetchError';

describe('src/utils/isFailedToFetchError', () => {
  it('recognizes network failures', () => {
    expect(isFailedToFetchError(new TypeError('Failed to fetch'))).toBe(true);
    expect(isFailedToFetchError(new Error('404 Not Found'))).toBe(false);
  });
});
