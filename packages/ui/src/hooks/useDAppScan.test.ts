import { renderHook } from '@testing-library/react';
import { useDAppScan } from './useDAppScan';
import { useFeatureFlagContext } from '../contexts/FeatureFlagsProvider';
import { FeatureGates } from '@core/types';

jest.mock('@blockaid/client', () => {
  return jest.fn().mockReturnValue({
    site: {
      scan: jest
        .fn()
        .mockResolvedValueOnce({
          status: 'miss',
        })
        .mockResolvedValueOnce({
          status: 'hit',
          is_malicious: false,
          url: 'good-dapp.com',
        })
        .mockRejectedValueOnce({
          error: 'error',
        }),
    },
  });
});

jest.mock('../contexts/FeatureFlagsProvider', () => ({
  useFeatureFlagContext: jest.fn(),
}));

describe('hooks/useDAppScan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      featureFlags: {
        [FeatureGates.BLOCKAID_DAPP_SCAN]: true,
      },
    } as any);
  });

  it('should return with `undefined` because the feature is disabled', async () => {
    jest.mocked(useFeatureFlagContext).mockReturnValue({
      featureFlags: {
        [FeatureGates.BLOCKAID_DAPP_SCAN]: false,
      },
    } as any);
    const { result } = renderHook(() => useDAppScan());
    const scanData = await result.current('alexander.com');
    expect(scanData).toBe(undefined);
  });
  it('should call the `blockaid site scan` and get a `miss` status', async () => {
    const { result } = renderHook(() => useDAppScan());
    const scanData = await result.current('alexander.com');
    expect(scanData).toEqual({ status: 'miss' });
  });
  it('should call the `blockaid site scan` and get a `miss` status', async () => {
    const { result } = renderHook(() => useDAppScan());
    const scanData = await result.current('good-dapp.com');
    expect(scanData).toEqual({
      status: 'hit',
      url: 'good-dapp.com',
      isMalicious: false,
    });
  });
  it('should throw an error', async () => {
    const { result } = renderHook(() => useDAppScan());
    try {
      await result.current('good-dapp.com');
    } catch (err: any) {
      expect(err.message).toBe(
        'There is an error during requesting the dApp data',
      );
    }
  });
});
