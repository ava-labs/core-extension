import { ThemeProvider } from '@avalabs/k2-alpine';
import { render } from '@shared/tests/test-utils';

import { CollapsedTokenAmount } from './CollapsedTokenAmount';

const renderAmount = (amount: string) =>
  render(
    <ThemeProvider theme="light" toastVariant="extension">
      <CollapsedTokenAmount amount={amount} />
    </ThemeProvider>,
  );

describe('CollapsedTokenAmount', () => {
  it('expands scientific notation instead of truncating the exponent', () => {
    expect(renderAmount('1.234567e+21').container.textContent).toBe(
      '1234567000000000000000',
    );
    expect(renderAmount('1.234567e+28').container.textContent).toBe(
      '12345670000000000000000000000',
    );
  });

  // The zero count is a styled digit, not a subscript glyph, so 0.0₆1 reads
  // as "0.0" + "6" + "1" in text content.
  it('collapses leading fraction zeroes', () => {
    expect(renderAmount('0.0000001').container.textContent).toBe('0.061');
  });

  it('truncates a long fraction to an approximation', () => {
    expect(renderAmount('1.123456789').container.textContent).toBe('~1.12345');
  });

  // Too long to spell out, so `expandExponentialNotation` returns it as-is.
  // Truncating the fraction here would drop the exponent and make amounts
  // orders of magnitude apart render identically.
  it('renders an unexpandable amount verbatim', () => {
    expect(renderAmount('1.234567e+600').container.textContent).toBe(
      '1.234567e+600',
    );
    expect(renderAmount('1.234567e+700').container.textContent).toBe(
      '1.234567e+700',
    );
  });
});
