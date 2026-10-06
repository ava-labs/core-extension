import { toSafeCssUrl } from './toSafeCssUrl';

// jsdom does not implement CSS.escape, and the escaping itself is the browser's
// job — all we own is handing it the parsed href and wrapping the result.
const escape = jest.fn((value: string) => `escaped(${value})`);

beforeAll(() => {
  globalThis.CSS = { escape } as unknown as typeof CSS;
});

describe('src/utils/toSafeCssUrl.ts', () => {
  it('wraps the escaped href in url()', () => {
    expect(toSafeCssUrl('https://example.com/logo.png')).toBe(
      'url("escaped(https://example.com/logo.png)")',
    );
    expect(escape).toHaveBeenCalledWith('https://example.com/logo.png');
  });

  it('returns none without escaping for missing or non-http(s) values', () => {
    expect(toSafeCssUrl(undefined)).toBe('none');
    expect(toSafeCssUrl('')).toBe('none');
    expect(toSafeCssUrl('not a url')).toBe('none');
    expect(toSafeCssUrl('javascript:alert(1)')).toBe('none');
    expect(toSafeCssUrl('data:image/svg+xml,<svg/>')).toBe('none');
    expect(escape).not.toHaveBeenCalled();
  });

  // A URL crafted to close the `url("...")` token and inject its own rules must
  // still reach CSS.escape rather than being interpolated verbatim.
  it.each([
    "https://evil.com/x);}[data-testid='alert']{display:none;}.z{background:url(x",
    'https://evil.com/a);}body{opacity:0}.b{background:url(a',
    'https://evil.com/"),url("https://attacker.example/exfil',
    'https://evil.com/a\\);}body{display:none}',
  ])('escapes the breakout payload %s', (payload) => {
    const href = new URL(payload).href;

    expect(toSafeCssUrl(payload)).toBe(`url("escaped(${href})")`);
    expect(escape).toHaveBeenCalledWith(href);
  });
});
