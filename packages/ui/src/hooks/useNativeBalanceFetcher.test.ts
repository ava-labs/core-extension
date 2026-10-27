import { renderHook } from '@testing-library/react';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';

import { useConnectionContext } from '../contexts';
import { useNativeBalanceFetcher } from './useNativeBalanceFetcher';

jest.mock('../contexts', () => ({
  useConnectionContext: jest.fn(),
}));

describe('hooks/useNativeBalanceFetcher', () => {
  it('caches balances per chain for addresses shared across chains', async () => {
    const request = jest.fn(async ({ params: [, chainCaipId] }) => ({
      balance: { balanceDisplayValue: chainCaipId },
    }));
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    const xpAddress = 'X-avax1shared';

    const { result: xChain } = renderHook(() =>
      useNativeBalanceFetcher(AvalancheCaip2ChainId.X),
    );
    const { result: pChain } = renderHook(() =>
      useNativeBalanceFetcher(AvalancheCaip2ChainId.P),
    );

    await xChain.current.fetchBalance(xpAddress);
    await pChain.current.fetchBalance(xpAddress);

    expect(await xChain.current.fetchBalance(xpAddress)).toEqual({
      balanceDisplayValue: AvalancheCaip2ChainId.X,
    });
    expect(await pChain.current.fetchBalance(xpAddress)).toEqual({
      balanceDisplayValue: AvalancheCaip2ChainId.P,
    });
    expect(request).toHaveBeenCalledTimes(2);
  });
});
