import { isLedgerAppVersionOutdated } from './isLedgerAppVersionOutdated';

describe('utils/isLedgerAppVersionOutdated', () => {
  it.each([
    ['0.8.4', '0.8.5'],
    ['0.8.9', '0.9.0'],
    ['0.9.9', '1.0.0'],
    ['0.9.0', '0.10.0'],
    ['1.2.3', '1.2.10'],
    [' 1.2.3 ', '1.2.4'],
  ])('returns true when %s is lower than %s', (installed, recommended) => {
    expect(isLedgerAppVersionOutdated(installed, recommended)).toBe(true);
  });

  it.each([
    ['1.2.3', '1.2.3'],
    ['1.2.4', '1.2.3'],
    ['0.10.0', '0.9.0'],
    ['2.0.0', '1.99.99'],
  ])(
    'returns false when %s is equal to or higher than %s',
    (installed, recommended) => {
      expect(isLedgerAppVersionOutdated(installed, recommended)).toBe(false);
    },
  );

  it.each([
    [null, '1.2.3'],
    [undefined, '1.2.3'],
    ['', '1.2.3'],
    ['1.2.3', null],
    ['1.2.3', undefined],
    ['1.2.3', ''],
    ['0.8.4', '1.2'],
    ['0.8.4', '1_2_3'],
    ['0.8.4', 'v1.2.3'],
    ['0.8.4', '1.2.3-beta'],
    ['0.8.4', 'latest'],
    ['0.8', '1.2.3'],
    ['abc', '1.2.3'],
  ])(
    'returns false when a version is missing or malformed (%p, %p)',
    (installed, recommended) => {
      expect(isLedgerAppVersionOutdated(installed, recommended)).toBe(false);
    },
  );
});
