import { getLedgerSentryTags } from './getLedgerSentryTags';

describe('packages/common/src/monitoring/getLedgerSentryTags', () => {
  it('maps the device details to Sentry tags', () => {
    expect(
      getLedgerSentryTags({
        deviceModel: 'flex',
        appName: 'Avalanche',
        appVersion: '1.4.22',
        firmwareVersion: '1.6.1',
      }),
    ).toEqual({
      'ledger.model': 'flex',
      'ledger.app': 'Avalanche',
      'ledger.appVersion': '1.4.22',
      'ledger.firmware': '1.6.1',
    });
  });

  it('omits unknown details', () => {
    expect(getLedgerSentryTags({ deviceModel: 'nanoSP' })).toEqual({
      'ledger.model': 'nanoSP',
    });
  });

  it('returns no tags without device details', () => {
    expect(getLedgerSentryTags(null)).toEqual({});
  });
});
