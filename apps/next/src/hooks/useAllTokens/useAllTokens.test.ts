import { renderHook, waitFor } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';
import { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';
import {
  useAccountsContext,
  useConnectionContext,
  useSettingsContext,
} from '@core/ui';

import { useTokensForAccount } from '@/hooks/useTokensForAccount';
import { getNetworkTokens } from './lib/getNetworkTokens';
import { useAllTokens } from './useAllTokens';

jest.mock('@core/ui');
jest.mock('@/hooks/useTokensForAccount');
jest.mock('./lib/getNetworkTokens');

const network = (chainId: number, caipId: string): NetworkWithCaipId =>
  ({ chainId, caipId }) as NetworkWithCaipId;

const erc20 = (
  address: string,
  coreChainId: number,
  balance = 0n,
): FungibleTokenBalance =>
  ({
    type: TokenType.ERC20,
    address,
    name: address,
    symbol: address,
    decimals: 18,
    balance,
    balanceDisplayValue: balance.toString(),
    reputation: null,
    assetType: 'evm_erc20',
    coreChainId,
    chainCaipId: `eip155:${coreChainId}`,
    logoUri: undefined,
  }) as FungibleTokenBalance;

const NETWORKS = [network(1, 'eip155:1'), network(2, 'eip155:2')];

describe('useAllTokens', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(useAccountsContext)
      .mockReturnValue({ accounts: { active: { id: 'acc' } } } as any);
    jest
      .mocked(useConnectionContext)
      .mockReturnValue({ request: jest.fn() } as any);
    jest
      .mocked(useSettingsContext)
      .mockReturnValue({ customTokens: {} } as any);
    jest.mocked(useTokensForAccount).mockReturnValue([]);
    jest.mocked(getNetworkTokens).mockResolvedValue([]);
  });

  it('does not fetch the per-network catalog when show-all is off', () => {
    const held = [erc20('0xheld', 1, 5n)];
    jest.mocked(useTokensForAccount).mockReturnValue(held);

    const { result } = renderHook(() => useAllTokens(NETWORKS));

    expect(getNetworkTokens).not.toHaveBeenCalled();
    expect(result.current).toEqual(held);
  });

  it('fetches the catalog for each network when show-all is on', async () => {
    jest
      .mocked(getNetworkTokens)
      .mockResolvedValueOnce([erc20('0xa', 1)])
      .mockResolvedValueOnce([erc20('0xb', 2)]);

    const { result } = renderHook(() => useAllTokens(NETWORKS, true));

    await waitFor(() => expect(result.current).toHaveLength(2));
    expect(getNetworkTokens).toHaveBeenCalledTimes(2);
  });

  it('does not fetch when fetchFullCatalog is explicitly false even with forceShowAllTokens', () => {
    renderHook(() => useAllTokens(NETWORKS, true, false));

    expect(getNetworkTokens).not.toHaveBeenCalled();
  });

  it('keeps tokens from networks that resolved when another network fails', async () => {
    jest
      .mocked(getNetworkTokens)
      .mockResolvedValueOnce([erc20('0xa', 1)])
      .mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useAllTokens(NETWORKS, true));

    await waitFor(() => expect(result.current).toHaveLength(1));
    expect((result.current[0] as { address?: string }).address).toBe('0xa');
  });

  it('includes user custom tokens as placeholders without fetching the catalog', () => {
    jest.mocked(useSettingsContext).mockReturnValue({
      customTokens: {
        1: {
          '0xcustom': {
            address: '0xCustom',
            name: 'Custom',
            symbol: 'CST',
            decimals: 18,
            contractType: 'ERC-20',
          },
        },
      },
    } as any);

    const { result } = renderHook(() => useAllTokens(NETWORKS));

    expect(getNetworkTokens).not.toHaveBeenCalled();
    expect(result.current).toHaveLength(1);
    expect((result.current[0] as { address?: string }).address).toBe(
      '0xCustom',
    );
  });

  it('clears catalog placeholders when show-all is toggled back off', async () => {
    jest.mocked(getNetworkTokens).mockResolvedValue([erc20('0xa', 1)]);

    const { result, rerender } = renderHook(
      ({ show }: { show: boolean }) => useAllTokens(NETWORKS, true, show),
      { initialProps: { show: true } },
    );

    await waitFor(() => expect(result.current).toHaveLength(1));

    rerender({ show: false });

    await waitFor(() => expect(result.current).toHaveLength(0));
  });
});
