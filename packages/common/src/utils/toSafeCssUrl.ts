// Characters that would terminate a quoted `url("...")` token or the surrounding
// style rule. Every one of them remains a valid URL once percent-encoded, so
// escaping never breaks a legitimate image.
const CSS_URL_BREAKOUT_CHARS = '"\'()\\{};';

const percentEncode = (char: string): string =>
  `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`;

const escapeForCssUrl = (value: string): string =>
  Array.from(value)
    .map((char) => {
      const code = char.charCodeAt(0);

      // Control characters (including NUL and DEL) and any whitespace.
      if (code < 0x20 || code === 0x7f || /\s/.test(char)) {
        return percentEncode(char);
      }

      return CSS_URL_BREAKOUT_CHARS.includes(char) ? percentEncode(char) : char;
    })
    .join('');

export const toSafeCssUrl = (rawUrl: string | undefined): string => {
  if (!rawUrl) {
    return 'none';
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    return 'none';
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return 'none';
  }

  return `url("${escapeForCssUrl(parsed.href)}")`;
};
