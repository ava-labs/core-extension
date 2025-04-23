import { isLedgerVersionCompatible } from 'packages/utils/src/isLedgerVersionCompatible';

describe('utils/isLedgerVersionCompatible.ts', () => {
  it('0.5.9 vs 0.6.0', () => {
    expect(isLedgerVersionCompatible('0.5.9', '0.6.0')).toBe(false);
  });
  it('0.6.0 vs 0.5.9', () => {
    expect(isLedgerVersionCompatible('0.6.0', '0.5.9')).toBe(true);
  });
  it('0.1.1 vs 0.0.99', () => {
    expect(isLedgerVersionCompatible('0.1.1', '0.0.99')).toBe(true);
  });
  it('0.9.9 vs 0.10.0', () => {
    expect(isLedgerVersionCompatible('0.9.9', '0.10.0')).toBe(false);
  });
  it('0.2.1 vs 0.2.0', () => {
    expect(isLedgerVersionCompatible('0.2.1', '0.2.0')).toBe(true);
  });
  it('0.11.9 vs 0.12.0', () => {
    expect(isLedgerVersionCompatible('0.11.1', '0.12.0')).toBe(false);
  });
  it('0.6.0 vs 0.6.0', () => {
    expect(isLedgerVersionCompatible('0.6.0', '0.6.0')).toBe(true);
  });
  it('0.6.10 vs 0.6.10', () => {
    expect(isLedgerVersionCompatible('0.6.10', '0.6.10')).toBe(true);
  });
  it('0.10.0 vs 0.9.0', () => {
    expect(isLedgerVersionCompatible('0.10.0', '0.9.0')).toBe(true);
  });
});
