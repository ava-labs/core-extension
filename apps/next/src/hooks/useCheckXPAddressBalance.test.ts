import { renderHook } from '@testing-library/react';
import { AvalancheCaip2ChainId } from '@avalabs/core-chains-sdk';
import { ExtensionRequest } from '@core/types';
import { useConnectionContext } from '@core/ui';

import { useCheckXPAddressBalance } from './useCheckXPAddressBalance';

jest.mock('@core/ui');

const TEST_ADDRESS = 'avax1qr6yg5aa3hsm4fhgdu5qm23dpnlsflukrt7lp0';

describe('useCheckXPAddressActivity', () => {
  const request = jest.fn();

  jest
    .mocked(useConnectionContext)
    .mockReturnValue({ request, events: jest.fn(), tabId: 1 });

  const balanceResponse = (value: bigint) => ({
    balance: { balance: value },
  });

  it('returns true when X-chain has balance', async () => {
    request
      .mockResolvedValueOnce(balanceResponse(100n))
      .mockResolvedValueOnce(balanceResponse(0n));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(true);
  });

  it('returns true when P-chain has balance', async () => {
    request
      .mockResolvedValueOnce(balanceResponse(0n))
      .mockResolvedValueOnce(balanceResponse(50n));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(true);
  });

  it('returns true when both chains have balance', async () => {
    request
      .mockResolvedValueOnce(balanceResponse(100n))
      .mockResolvedValueOnce(balanceResponse(50n));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(true);
  });

  it('returns false when both chains have zero balance', async () => {
    request
      .mockResolvedValueOnce(balanceResponse(0n))
      .mockResolvedValueOnce(balanceResponse(0n));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(false);
  });

  it('returns false when both requests fail', async () => {
    request.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(false);
  });

  it('returns true when one chain has balance and the other fails', async () => {
    request
      .mockResolvedValueOnce(balanceResponse(100n))
      .mockRejectedValueOnce(new Error('network error'));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    const hasActivity = await result.current(TEST_ADDRESS);

    expect(hasActivity).toBe(true);
  });

  it('calls request with correct params for both chains', async () => {
    request.mockResolvedValue(balanceResponse(0n));

    const { result } = renderHook(() => useCheckXPAddressBalance());
    await result.current(TEST_ADDRESS);

    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.BALANCE_NATIVE_GET,
      params: [TEST_ADDRESS, AvalancheCaip2ChainId.X],
    });
    expect(request).toHaveBeenCalledWith({
      method: ExtensionRequest.BALANCE_NATIVE_GET,
      params: [TEST_ADDRESS, AvalancheCaip2ChainId.P],
    });
  });
});
