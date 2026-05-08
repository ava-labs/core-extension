import { isUrlValid } from './url';

describe('isUrlValid', () => {
  it.each([
    'https://example.com',
    'http://localhost:9650',
    'https://subnets.avax-dev.network/p-chain',
    'http://127.0.0.1:8080/path?query=1#hash',
  ])('returns true for http(s) URL %s', (url) => {
    expect(isUrlValid(url)).toBe(true);
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'ftp://example.com',
    'chrome-extension://abc/popup.html',
  ])('returns false for non-http(s) URL %s', (url) => {
    expect(isUrlValid(url)).toBe(false);
  });

  it.each([
    'https://user:pass@example.com',
    'http://user@example.com',
    'https://:password@example.com',
  ])('returns false when URL embeds credentials (%s)', (url) => {
    expect(isUrlValid(url)).toBe(false);
  });

  it.each(['', 'not a url', 'http://', '://example.com'])(
    'returns false for malformed URL %s',
    (url) => {
      expect(isUrlValid(url)).toBe(false);
    },
  );
});
