import { formatCurrency } from './formatAmount';

describe('formatCurrency', () => {
  describe('standard formatting (amounts >= 1)', () => {
    it('should format regular amounts with 2 decimal places', () => {
      expect(
        formatCurrency({
          amount: 123.45,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$123.45');
    });

    it('should format large amounts with commas', () => {
      expect(
        formatCurrency({
          amount: 1234567.89,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$1,234,567.89');
    });

    it('should handle negative amounts', () => {
      expect(
        formatCurrency({
          amount: -123.45,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('-$123.45');
    });
  });

  describe('small amounts (< 0.01)', () => {
    it('should format amounts < 0.01 with 3 decimal places', () => {
      expect(
        formatCurrency({
          amount: 0.005,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$0.005');
    });

    it('should format very small amounts', () => {
      expect(
        formatCurrency({
          amount: 0.001,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$0.001');
    });

    it('should handle negative small amounts', () => {
      expect(
        formatCurrency({
          amount: -0.005,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('-$0.005');
    });
  });

  describe('high precision formatting (< 0.1 with boost)', () => {
    it('should format small amounts with high precision when boostSmallNumberPrecision is true', () => {
      expect(
        formatCurrency({
          amount: 0.05,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.05');
    });

    it('should format very small amounts with up to 6 decimal places', () => {
      expect(
        formatCurrency({
          amount: 0.000123456789,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.000123');
    });

    it('should handle zero with high precision', () => {
      expect(
        formatCurrency({
          amount: 0,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.00');
    });

    it('should use floor rounding for high precision', () => {
      expect(
        formatCurrency({
          amount: 0.0009999,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.000999');
    });
  });

  describe('compact notation', () => {
    it('should format thousands in compact notation', () => {
      expect(
        formatCurrency({
          amount: 1200,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          notation: 'compact',
        }),
      ).toBe('$1.2K');
    });

    it('should format millions in compact notation', () => {
      expect(
        formatCurrency({
          amount: 1500000,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          notation: 'compact',
        }),
      ).toBe('$1.5M');
    });

    it('should format billions in compact notation', () => {
      expect(
        formatCurrency({
          amount: 2500000000,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          notation: 'compact',
        }),
      ).toBe('$2.5B');
    });
  });

  describe('showLessThanThreshold', () => {
    it('should show "< $0.001" for very small amounts when showLessThanThreshold is true', () => {
      expect(
        formatCurrency({
          amount: 0.0005,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          showLessThanThreshold: true,
        }),
      ).toBe('<$0.001');
    });

    it('should not show threshold for amounts >= 0.001', () => {
      expect(
        formatCurrency({
          amount: 0.001,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          showLessThanThreshold: true,
        }),
      ).toBe('$0.001');
    });

    it('should show threshold for negative small amounts (absolute value)', () => {
      expect(
        formatCurrency({
          amount: -0.0005,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          showLessThanThreshold: true,
        }),
      ).toBe('<$0.001');
    });

    it('should format normally when showLessThanThreshold is false', () => {
      expect(
        formatCurrency({
          amount: 0.0005,
          currency: 'USD',
          boostSmallNumberPrecision: false,
          showLessThanThreshold: false,
        }),
      ).toBe('$0.001');
    });
  });

  describe('different currencies', () => {
    it('should format EUR currency', () => {
      expect(
        formatCurrency({
          amount: 123.45,
          currency: 'EUR',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('€123.45');
    });

    it('should format GBP currency', () => {
      expect(
        formatCurrency({
          amount: 123.45,
          currency: 'GBP',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('£123.45');
    });

    it('should format JPY currency (no decimals)', () => {
      expect(
        formatCurrency({
          amount: 12345,
          currency: 'JPY',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('¥12,345.00');
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(
        formatCurrency({
          amount: 0,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$0.00');
    });

    it('should handle very large numbers', () => {
      expect(
        formatCurrency({
          amount: 999999999.99,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$999,999,999.99');
    });

    it('should handle very small positive numbers with boost precision', () => {
      expect(
        formatCurrency({
          amount: 0.000001,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.000001');
    });

    it('should handle fractional cents', () => {
      expect(
        formatCurrency({
          amount: 1.999,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$2.00');
    });
  });

  describe('precision boundaries', () => {
    it('should use standard format for amounts >= 0.01 without boost', () => {
      expect(
        formatCurrency({
          amount: 0.01,
          currency: 'USD',
          boostSmallNumberPrecision: false,
        }),
      ).toBe('$0.01');
    });

    it('should use high precision for amounts < 0.1 with boost', () => {
      expect(
        formatCurrency({
          amount: 0.099,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.099');
    });

    it('should use standard format for amounts >= 0.1 even with boost', () => {
      expect(
        formatCurrency({
          amount: 0.1,
          currency: 'USD',
          boostSmallNumberPrecision: true,
        }),
      ).toBe('$0.10');
    });
  });
});
