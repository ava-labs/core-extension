import isLedgerBtcAppCorrect from './isLedgerBtcAppCorrect';

type TestEntries = {
  applicationName: string;
  version: string;
  expected: boolean;
};

describe('utils/isLedgerBtcAppCorrect.ts', () => {
  const appInfoList: TestEntries[] = [
    // Any version of Bitcoin Legacy
    { applicationName: 'Bitcoin Legacy', version: '1.0.0', expected: true },
    { applicationName: 'Bitcoin Legacy', version: '100.0.0', expected: true },
    // Bitcoin < 2.1.0
    { applicationName: 'Bitcoin', version: '1.0.0', expected: true },
    { applicationName: 'Bitcoin', version: '2.0.6', expected: true },
    // Bitcoin >= 2.1.0
    { applicationName: 'Bitcoin', version: '2.1.0', expected: false },
    { applicationName: 'Bitcoin', version: '2.2.1', expected: false },
    // Any version of a non BTC app
    { applicationName: 'Unknown', version: '1.0.0', expected: true },
    { applicationName: 'Unknown', version: '100.0.0', expected: true },
  ];

  it.each(appInfoList)(
    'returns $expected for $applicationName ($version)',
    async ({ applicationName, version, expected }) => {
      expect(isLedgerBtcAppCorrect({ applicationName, version })).toBe(
        expected
      );
    }
  );
});
