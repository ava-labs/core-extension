import { Account, AccountType } from '@src/background/services/accounts/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { renderHook } from '@testing-library/react-hooks';
import { useBalanceTotalInCurrency } from './useBalanceTotalInCurrency';

jest.mock('@src/contexts/BalancesProvider', () => ({
  useBalancesContext: jest.fn(),
}));

const mockAccount: Account = {
  index: 0,
  id: 'uuid',
  name: 'Account 1',
  addressBTC: `bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed`,
  addressC: '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  addressAVM: '',
  addressPVM: '',
  addressCoreEth: '',
  type: AccountType.PRIMARY,
};

describe('hooks/useBalanceTotalInCurrency', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (useBalancesContext as jest.Mock).mockReturnValue({
      getTotalBalance: jest.fn().mockReturnValue(23),
    });
  });

  it('returns null if address is not provided', () => {
    const { result } = renderHook(() => useBalanceTotalInCurrency());
    expect(result.current).toBeNull();
  });

  it('returns the total balance of the given address', () => {
    const { result } = renderHook(() => useBalanceTotalInCurrency(mockAccount));
    expect(result.current).toBe(23);
  });
});
