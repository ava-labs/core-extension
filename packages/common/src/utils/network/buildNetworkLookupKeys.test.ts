import { buildNetworkLookupKeys } from './buildNetworkLookupKeys';

describe('buildNetworkLookupKeys', () => {
  it('expands decimal Base chain id', () => {
    expect(buildNetworkLookupKeys('8453')).toEqual([
      '8453',
      8453,
      'eip155:8453',
    ]);
  });

  it('accepts numeric chain id', () => {
    expect(buildNetworkLookupKeys(8453)).toEqual(['8453', 8453, 'eip155:8453']);
  });

  it('expands hex chain id', () => {
    expect(buildNetworkLookupKeys('0x2105')).toEqual([
      '0x2105',
      8453,
      'eip155:8453',
    ]);
  });

  it('parses eip155 scope', () => {
    expect(buildNetworkLookupKeys('eip155:8453')).toEqual([
      'eip155:8453',
      8453,
    ]);
  });
});
