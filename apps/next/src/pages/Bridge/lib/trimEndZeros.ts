const TRAILING_ZEROES_REGEX = /(\.\d*?)0+$/;
const TRAILING_DOT_REGEX = /\.$/;

export function trimEndZeros(numeric: string) {
  return numeric
    .replace(TRAILING_ZEROES_REGEX, '$1')
    .replace(TRAILING_DOT_REGEX, '');
}
