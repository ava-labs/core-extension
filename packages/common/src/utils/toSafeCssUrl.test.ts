import { toSafeCssUrl } from './toSafeCssUrl';

describe('src/utils/toSafeCssUrl.ts', () => {
  it('returns a quoted url() for ordinary http(s) URLs', () => {
    expect(toSafeCssUrl('https://example.com/logo.png')).toBe(
      'url("https://example.com/logo.png")',
    );
    expect(toSafeCssUrl('http://example.com/logo.png')).toBe(
      'url("http://example.com/logo.png")',
    );
  });

  it('returns none for missing or non-http(s) values', () => {
    expect(toSafeCssUrl(undefined)).toBe('none');
    expect(toSafeCssUrl('')).toBe('none');
    expect(toSafeCssUrl('not a url')).toBe('none');
    expect(toSafeCssUrl('javascript:alert(1)')).toBe('none');
    expect(toSafeCssUrl('data:image/svg+xml,<svg/>')).toBe('none');
  });

  describe('CSS breakout', () => {
    const payloads = [
      "https://evil.com/x);}[data-testid='alert']{display:none;}.z{background:url(x",
      'https://evil.com/a);}body{opacity:0}.b{background:url(a',
      'https://evil.com/"),url("https://attacker.example/exfil',
      'https://evil.com/a\\);}body{display:none}',
    ];

    it.each(payloads)('neutralizes %s', (payload) => {
      const result = toSafeCssUrl(payload);

      // Exactly one url(" opening and one ") closing, and nothing in between can
      // terminate either the token or the rule.
      expect(result.startsWith('url("')).toBe(true);
      expect(result.endsWith('")')).toBe(true);

      const inner = result.slice('url("'.length, -'")'.length);
      expect(inner).not.toMatch(/["'()\\{};]/);
      expect(inner).not.toMatch(/\s/);
    });

    it('percent-encodes the breakout characters rather than dropping them', () => {
      // `}` is already normalized to %7D by the URL parser; `)` and `;` are not
      // touched by it, so our escaper encodes those.
      expect(toSafeCssUrl('https://evil.com/a);}b')).toBe(
        'url("https://evil.com/a%29%3b%7Db")',
      );
    });
  });
});
