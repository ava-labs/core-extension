import {
  encodeHypercoreFillMethod,
  fillLabel,
  formatHypercoreFillPx,
  parseHypercoreFillMethod,
  tickerOfCoin,
} from './hypercoreFillMeta';

describe('tickerOfCoin', () => {
  it('strips dex prefix', () => {
    expect(tickerOfCoin('xyz:GOLD')).toBe('GOLD');
    expect(tickerOfCoin('ETH')).toBe('ETH');
  });
});

describe('fillLabel', () => {
  it('maps close/open dirs like web', () => {
    expect(fillLabel('Close Long')).toMatchObject({
      text: 'Long closed',
      tone: 'profit',
    });
    expect(fillLabel('Close Short')).toMatchObject({
      text: 'Short closed',
      tone: 'loss',
    });
    expect(fillLabel('Open Long').text).toBe('Order opened');
    expect(fillLabel('Open Short').text).toBe('Order opened');
    expect(fillLabel('Cancel').text).toBe('Order cancelled');
  });
});

describe('formatHypercoreFillPx', () => {
  it('formats numeric px as USD', () => {
    expect(formatHypercoreFillPx('1684.7')).toMatch(/^\$/);
  });
});

describe('hypercore fill method codec', () => {
  it('round-trips meta', () => {
    const meta = {
      dir: 'Open Long',
      px: '2000',
      closedPnl: '0',
      coin: 'ETH',
    };
    expect(parseHypercoreFillMethod(encodeHypercoreFillMethod(meta))).toEqual(
      meta,
    );
  });

  it('returns undefined for unrelated methods', () => {
    expect(parseHypercoreFillMethod('transfer')).toBeUndefined();
    expect(parseHypercoreFillMethod(undefined)).toBeUndefined();
  });
});
