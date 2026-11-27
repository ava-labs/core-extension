import { render, screen } from '@testing-library/react';

import { SwappedTokenRows } from './SwappedTokenRows';

jest.mock('@/components/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('./Styled', () => ({ Divider: () => <hr /> }));
jest.mock('./TokemAmountInfoBox', () => ({
  TokemAmountInfoBox: ({ token }: { token: { symbol: string } }) => (
    <span>{token.symbol}</span>
  ),
}));
jest.mock('./TokemAmountInfoBox/components', () => ({
  TokenAmountInfoSkeleton: () => <span>loading</span>,
}));

const row = (type: 'paid' | 'received', symbol: string) =>
  ({
    type,
    tokenId: symbol,
    amount: 1n,
    token: { symbol, coreChainId: 1 },
  }) as never;

describe('SwappedTokenRows', () => {
  it('shows a skeleton per row while nothing has resolved', () => {
    render(<SwappedTokenRows tokens={[]} isPending />);

    expect(
      screen.getByTestId('fusion-transfer-summary-skeleton-paid'),
    ).toBeTruthy();
    expect(
      screen.getByTestId('fusion-transfer-summary-skeleton-received'),
    ).toBeTruthy();
  });

  it('keeps a skeleton for the still-missing row when partially resolved', () => {
    render(<SwappedTokenRows tokens={[row('paid', 'AAA')]} isPending />);

    expect(screen.getByText('AAA')).toBeTruthy();
    expect(
      screen.queryByTestId('fusion-transfer-summary-skeleton-paid'),
    ).toBeNull();
    expect(
      screen.getByTestId('fusion-transfer-summary-skeleton-received'),
    ).toBeTruthy();
  });

  it('renders only the resolved rows once completed', () => {
    render(
      <SwappedTokenRows
        tokens={[row('paid', 'AAA'), row('received', 'BBB')]}
        isPending={false}
      />,
    );

    expect(screen.getByText('AAA')).toBeTruthy();
    expect(screen.getByText('BBB')).toBeTruthy();
    expect(screen.queryByText('loading')).toBeNull();
  });

  it('does not show skeletons when not pending and nothing resolved', () => {
    render(<SwappedTokenRows tokens={[]} isPending={false} />);

    expect(screen.queryByText('loading')).toBeNull();
  });
});
