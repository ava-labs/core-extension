import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { isCoreWeb } from './isCoreWeb';
import browser from 'webextension-polyfill';
jest.mock('webextension-polyfill');

jest.mock('webextension-polyfill', () => ({
  tabs: { get: jest.fn() },
}));

describe('src/background/services/network/utils/isCoreWeb.ts', () => {
  const emptyRequest = {
    id: 'test',
    method: DAppProviderRequest.ACCOUNT_SELECT,
  };

  const request = {
    ...emptyRequest,
    site: { tabId: 123, domain: 'core.app', name: 'Core' },
  };
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(browser.tabs.get).mockRejectedValue(new Error());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('should return false when missing info ', () => {
    it('should return false if site is missing', async () => {
      const result = await isCoreWeb(emptyRequest);
      expect(result).toEqual(false);
    });
    it('should return false if tabId is missing', async () => {
      const result = await isCoreWeb({
        ...emptyRequest,
        site: { tabId: undefined, domain: 'core.app', name: 'Core' },
      });
      expect(result).toEqual(false);
    });
    it('should return false if domain is missing', async () => {
      const result = await isCoreWeb({
        ...emptyRequest,
        site: { tabId: 123, domain: '', name: 'Core' },
      });
      expect(result).toEqual(false);
    });
    it('should return false if name is missing', async () => {
      const result = await isCoreWeb({
        ...emptyRequest,
        site: { tabId: 123, domain: 'core.app', name: undefined },
      });
      expect(result).toEqual(false);
    });
  });

  it('should return false if tab cannot be found', async () => {
    const result = await isCoreWeb(request);
    expect(result).toEqual(false);
  });

  it('should return false if tab is not active', async () => {
    jest.mocked(browser.tabs.get).mockResolvedValue({
      active: false,
      url: 'https://core.app/',
      index: 0,
      highlighted: false,
      pinned: false,
      incognito: false,
    });

    const result = await isCoreWeb(request);
    expect(result).toEqual(false);
  });

  it('should return false if tab url does not match', async () => {
    jest.mocked(browser.tabs.get).mockResolvedValue({
      active: true,
      url: 'https://core.fake.app/',
      index: 0,
      highlighted: false,
      pinned: false,
      incognito: false,
    });

    const result = await isCoreWeb(request);
    expect(result).toEqual(false);
  });

  it('should return true if tab info match', async () => {
    jest.mocked(browser.tabs.get).mockResolvedValue({
      active: true,
      url: 'https://core.app/',
      index: 0,
      highlighted: false,
      pinned: false,
      incognito: false,
    });

    const result = await isCoreWeb(request);
    expect(result).toEqual(true);
  });
});
