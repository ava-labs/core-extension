import { BrowserInfo, detect } from 'detect-browser';
import { isSupportedBrowser, supportedBrowsers } from './isSupportedBrowser';

jest.mock('detect-browser');

describe('isSupportedBrowser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns false for unsupported browser', () => {
    jest
      .mocked(detect)
      .mockReturnValueOnce({ name: 'unusupported' } as unknown as BrowserInfo);

    expect(isSupportedBrowser()).toBe(false);
  });

  it.each(
    supportedBrowsers.map((supportedBrowser) => ({
      type: supportedBrowser,
    })),
  )('returns true for $type', ({ type }) => {
    jest
      .mocked(detect)
      .mockReturnValueOnce({ name: type } as unknown as BrowserInfo);

    expect(isSupportedBrowser()).toBe(true);
  });
});
