import { act, renderHook } from '@testing-library/react';

import {
  Account,
  FungibleTokenBalance,
  NetworkFee,
  NetworkWithCaipId,
} from '@core/types';
import { useConnectionContext, useNetworkFeeContext } from '@core/ui';
import { useSendMaxAmount } from '@/pages/Send/contexts';
import { getDefaultFeePreset } from '@/utils/getDefaultFeePreset';

import { useEvmNativeSend } from './useEvmNativeSend';

jest.mock('@core/ui');
jest.mock('@/pages/Send/contexts');
jest.mock('@/utils/getDefaultFeePreset');
jest.mock('@/lib/getEvmProvider', () => ({ getEvmProvider: jest.fn() }));
jest.mock('./useTransactionCallbacks', () => ({
  useTransactionCallbacks: () => ({
    onSendApproved: jest.fn(),
    onSendFailure: jest.fn(),
    onSendSuccess: jest.fn(),
  }),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (s: string) => s }),
}));

const networkFee = {
  low: { maxFeePerGas: 1n, maxPriorityFeePerGas: 1n },
  medium: { maxFeePerGas: 2n, maxPriorityFeePerGas: 2n },
  high: { maxFeePerGas: 16n, maxPriorityFeePerGas: 3n },
} as unknown as NetworkFee;

describe('useEvmNativeSend', () => {
  const request = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    request.mockResolvedValue('0xhash');
    jest.mocked(useConnectionContext).mockReturnValue({ request } as any);
    jest.mocked(useNetworkFeeContext).mockReturnValue({
      getNetworkFee: jest.fn().mockResolvedValue(networkFee),
      isGaslessOn: false,
    } as any);
    jest.mocked(useSendMaxAmount).mockReturnValue({
      maxAmount: 100n,
      estimatedFee: 1n,
      networkFee,
      isCalculating: false,
    });
  });

  it.each([
    ['high', '0x10', '0x3'],
    ['medium', '0x2', '0x2'],
  ] as const)(
    'submits with the %s tier from getDefaultFeePreset',
    async (preset, maxFee, priority) => {
      jest.mocked(getDefaultFeePreset).mockReturnValue(preset);

      const { result } = renderHook(() =>
        useEvmNativeSend({
          token: { coreChainId: 43114 } as unknown as FungibleTokenBalance,
          amount: 5n,
          from: { addressC: '0xfrom' } as unknown as Account,
          to: '0xto',
          network: { chainId: 43114 } as unknown as NetworkWithCaipId,
        }),
      );

      await act(async () => {
        await result.current.send();
      });

      const [{ params }] = request.mock.calls[0]!;
      expect(params[0].maxFeePerGas).toBe(maxFee);
      expect(params[0].maxPriorityFeePerGas).toBe(priority);
    },
  );
});
