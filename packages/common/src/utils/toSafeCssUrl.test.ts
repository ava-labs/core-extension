import { toSafeCssUrl } from './toSafeCssUrl';

// jsdom does not implement CSS.escape. This is the CSSOM algorithm so the
// suite exercises the same API Chrome provides in the extension page.
const cssEscape = (value: string): string => {
  const string = String(value);
  const length = string.length;
  let result = '';
  const firstCodeUnit = string.charCodeAt(0);

  for (let index = 0; index < length; index += 1) {
    const codeUnit = string.charCodeAt(index);

    if (codeUnit === 0x0000) {
      result += '\uFFFD';
      continue;
    }

    if (
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit === 0x007f ||
      (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (index === 1 &&
        codeUnit >= 0x0030 &&
        codeUnit <= 0x0039 &&
        firstCodeUnit === 0x002d)
    ) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    if (
      codeUnit >= 0x0080 ||
      codeUnit === 0x002d ||
      codeUnit === 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      result += string.charAt(index);
      continue;
    }

    result += `\\${string.charAt(index)}`;
  }

  return result;
};

beforeAll(() => {
  if (typeof CSS === 'undefined') {
    globalThis.CSS = { escape: cssEscape, supports: () => false } as typeof CSS;
  }
});

describe('src/utils/toSafeCssUrl.ts', () => {
  it('returns a quoted url() for ordinary http(s) URLs', () => {
    expect(toSafeCssUrl('https://example.com/logo.png')).toBe(
      `url("${CSS.escape('https://example.com/logo.png')}")`,
    );
    expect(toSafeCssUrl('http://example.com/logo.png')).toBe(
      `url("${CSS.escape('http://example.com/logo.png')}")`,
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
      const href = new URL(payload).href;
      const result = toSafeCssUrl(payload);

      expect(result).toBe(`url("${CSS.escape(href)}")`);

      const element = document.createElement('div');
      element.style.cssText = `background-image: ${result};`;
      expect(element.style.opacity).toBe('');
      expect(element.style.display).toBe('');
    });
  });
});
