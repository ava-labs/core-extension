import { getCoreWebPortfolioUrl, getCoreWebUrl } from './getCoreWebUrl';

describe('utils/getCoreWebUrl.ts', () => {
  describe('getCoreWebUrl', () => {
    const env = process.env;

    beforeEach(() => {
      process.env = {
        ...env,
        CORE_WEB_BASE_URL: 'https://core.app',
      };
    });

    it('returns Core Web URL with address', () => {
      expect(getCoreWebUrl('0x00000')).toBe(
        'https://core.app/portfolio/0x00000',
      );
    });
    it('returns base Core Web URL with no address', () => {
      expect(getCoreWebUrl('')).toBe('https://core.app');
    });
  });

  describe('getCoreWebPortfolioUrl', () => {
    it('returns Core Web Portfolio URL with query', () => {
      expect(getCoreWebPortfolioUrl('new-user=1')).toBe(
        'https://core.app/portfolio?new-user=1',
      );
    });
  });
});
