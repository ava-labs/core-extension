import { renderHook } from '@testing-library/react';
import { TokenType } from '@avalabs/vm-module-types';
import { FungibleTokenBalance, NetworkWithCaipId } from '@core/types';
import { useNetworkContext, useSettingsContext } from '@core/ui';

import { useAllTokens } from './useAllTokens/useAllTokens';
import { useAllTokensFromEnabledNetworks } from './useAllTokensFromEnabledNetworks';

jest.mock('@core/ui');
jest.mock('./useAllTokens/useAllTokens');

const ENABLED = [{ chainId: 1, caipId: 'eip155:1' }] as NetworkWithCaipId[];

const erc20 = (address: string, balance: bigint): FungibleTokenBalance =>
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
    coreChainId: 1,
    chainCaipId: 'eip155:1',
  }) as FungibleTokenBalance;

const held = erc20('0xheld', 5n);
const zeroBalanceListed = erc20('0xlisted', 0n);
const zeroBalanceCustom = erc20('0xcustom', 0n);

describe('useAllTokensFromEnabledNetworks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest
      .mocked(useNetworkContext)
      .mockReturnValue({ enabledNetworks: ENABLED } as any);
    jest.mocked(useSettingsContext).mockReturnValue({
      customTokens: { 1: { '0xcustom': {} } },
    } as any);
    jest
      .mocked(useAllTokens)
      .mockReturnValue([held, zeroBalanceListed, zeroBalanceCustom]);
  });

  it('requests the full catalog and returns everything when showing tokens without balance', () => {
    const { result } = renderHook(() => useAllTokensFromEnabledNetworks(false));

    expect(useAllTokens).toHaveBeenCalledWith(ENABLED, true, true);
    expect(result.current).toEqual([
      held,
      zeroBalanceListed,
      zeroBalanceCustom,
    ]);
  });

  it('skips the full catalog and keeps only held or custom tokens for the balance-only view', () => {
    const { result } = renderHook(() => useAllTokensFromEnabledNetworks(true));

    expect(useAllTokens).toHaveBeenCalledWith(ENABLED, true, false);
    expect(result.current).toEqual([held, zeroBalanceCustom]);
  });
});
