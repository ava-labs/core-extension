import {
  closedPnlTone,
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

describe('closedPnlTone', () => {
  it('maps sign to profit/loss and ignores zero/invalid', () => {
    expect(closedPnlTone('1.5')).toBe('profit');
    expect(closedPnlTone('-0.01')).toBe('loss');
    expect(closedPnlTone('0')).toBeUndefined();
    expect(closedPnlTone(undefined)).toBeUndefined();
    expect(closedPnlTone('abc')).toBeUndefined();
  });
});

describe('fillLabel', () => {
  it('maps close/open dirs and derives tone from closedPnl', () => {
    expect(fillLabel('Close Long', '12.5')).toMatchObject({
      text: 'Long closed',
      tone: 'profit',
    });
    expect(fillLabel('Close Long', '-3')).toMatchObject({
      text: 'Long closed',
      tone: 'loss',
    });
    expect(fillLabel('Close Short', '4')).toMatchObject({
      text: 'Short closed',
      tone: 'profit',
    });
    expect(fillLabel('Close Short', '-4')).toMatchObject({
      text: 'Short closed',
      tone: 'loss',
    });
    expect(fillLabel('Close Short').tone).toBeUndefined();
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
