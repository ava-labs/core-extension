import { ChainId, Network, NetworkVMType } from '@avalabs/chains-sdk';
import { Account, AccountType } from '@src/background/services/accounts/models';
import {
  Balances,
  TokenType,
  TokenWithBalance,
} from '@src/background/services/balances/models';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { renderHook } from '@testing-library/react-hooks';
import { useBalanceTotalInCurrency } from './useBalanceTotalInCurrency';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

jest.mock('@src/contexts/BalancesProvider', () => ({
  useBalancesContext: jest.fn(),
}));

jest.mock('@src/contexts/NetworkProvider', () => ({
  useNetworkContext: jest.fn(),
}));

jest.mock('@src/contexts/ConnectionProvider', () => ({
  useConnectionContext: jest.fn(),
}));

const mockNetwork: Network = {
  chainName: 'the chain',
  chainId: 1,
  vmName: NetworkVMType.EVM,
  rpcUrl: '',
  logoUri: '',
  networkToken: {} as any,
  primaryColor: 'red',
};

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

const mockBalances: Balances = {
  tokens: {
    balances: {
      [1]: {
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': [
          {
            balanceUSD: 10,
            type: TokenType.NATIVE,
          },
          {
            balanceUSD: 0.2,
            type: TokenType.ERC20,
          },
          {
            type: TokenType.ERC20,
          },
        ] as Partial<TokenWithBalance>[],
      },
      [2]: {
        '0x22222eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': [
          {
            balanceUSD: 5,
            type: TokenType.NATIVE,
          },
        ] as Partial<TokenWithBalance>[],
        '0x11111eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': [
          {
            balanceUSD: 0,
            type: TokenType.NATIVE,
          },
          {
            balanceUSD: 3,
            type: TokenType.NATIVE,
          },
        ] as Partial<TokenWithBalance>[],
      },
      [ChainId.BITCOIN]: {
        bc1qy76a8lk4ym3af4u45f7fghuqc6ftfh7l6c87ed: [
          {
            balanceUSD: 5653,
            type: TokenType.NATIVE,
          },
        ] as Partial<TokenWithBalance>[],
      },
    } as any,
  },
};

describe('hooks/useBalanceTotalInCurrency', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (useBalancesContext as jest.Mock).mockReturnValue({
      ...mockBalances,
      totalBalance: 23,
    });
    (useConnectionContext as jest.Mock).mockReturnValue({
      request: jest.fn(),
    });

    (useNetworkContext as jest.Mock).mockReturnValue({
      networks: [
        { ...mockNetwork },
        { ...mockNetwork, chainId: 2 },
        {
          ...mockNetwork,
          chainId: ChainId.BITCOIN,
          vmName: NetworkVMType.BITCOIN,
        },
      ],
      network: {
        ...mockNetwork,
      },
      favoriteNetworks: [],
    });
  });

  it('returns balance for all networks', () => {
    const { result } = renderHook(() => useBalanceTotalInCurrency(mockAccount));

    expect(result.current).toBe(5666.2);
  });

  it('returns balance for favorite and active networks from state', () => {
    (useNetworkContext as jest.Mock).mockReturnValue({
      networks: [
        { ...mockNetwork },
        { ...mockNetwork, chainId: 2 },
        {
          ...mockNetwork,
          chainId: ChainId.BITCOIN,
          vmName: NetworkVMType.BITCOIN,
        },
      ],
      network: {
        ...mockNetwork,
      },
      favoriteNetworks: [{ ...mockNetwork, chainId: 2 }],
    });

    const { result } = renderHook(() =>
      useBalanceTotalInCurrency(mockAccount, true)
    );

    expect(result.current).toBe(23);
  });

  it('returns balance for active network when there are no favorites from state', () => {
    const { result } = renderHook(() =>
      useBalanceTotalInCurrency(mockAccount, true)
    );

    expect(result.current).toBe(23);
  });

  it('returns null when account is missing', () => {
    const { result } = renderHook(() => useBalanceTotalInCurrency());

    expect(result.current).toBe(null);
  });

  it('returns null when balances are not available', () => {
    (useBalancesContext as jest.Mock).mockReturnValue({
      tokens: {
        balances: undefined,
      },
    });

    const { result } = renderHook(() => useBalanceTotalInCurrency(mockAccount));

    expect(result.current).toBe(null);
  });

  it('returns null till all required networks are loaded', () => {
    (useBalancesContext as jest.Mock).mockReturnValue({
      tokens: {
        balances: {
          [1]: {
            ...(mockBalances.tokens?.balances?.[1] || []),
          },
        },
      },
    });

    const { result, rerender } = renderHook(() =>
      useBalanceTotalInCurrency(mockAccount)
    );

    expect(result.current).toBe(null);

    (useBalancesContext as jest.Mock).mockReturnValue({ ...mockBalances });
    rerender();

    expect(result.current).toBe(5666.2);
  });
});
