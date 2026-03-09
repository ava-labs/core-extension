import { renderHook, act } from '@testing-library/react';
import { RpcMethod } from '@avalabs/vm-module-types';
import { Action, ActionType, GaslessPhase } from '@core/types';
import { useAnalyticsContext, useNetworkFeeContext } from '@core/ui';
import { DisplayData } from '@avalabs/vm-module-types';
import { toast } from '@avalabs/k2-alpine';
import { useGasless } from './useGasless';

jest.mock('@avalabs/k2-alpine', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@core/ui');
jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  caipToChainId: jest.fn().mockReturnValue(43114),
}));

const mockCaptureEncrypted = jest.fn();

const defaultNetworkFeeContext: ReturnType<typeof useNetworkFeeContext> = {
  isGaslessOn: true,
  setIsGaslessOn: jest.fn(),
  gaslessFundTx: jest.fn(),
  fundTxHex: '',
  setGaslessDefaultValues: jest.fn(),
  gaslessPhase: GaslessPhase.READY,
  setGaslessEligibility: jest.fn(),
  fetchAndSolveGaslessChallange: jest.fn(),
  isGaslessEligible: true,
  networkFee: null,
  getNetworkFee: jest.fn(),
};

const mockAction: Action<DisplayData> = {
  id: 'test-action-id',
  method: RpcMethod.ETH_SEND_TRANSACTION,
  type: ActionType.Single,
  scope: 'eip155:43114',
  displayData: {} as DisplayData,
  signingData: {
    type: RpcMethod.ETH_SEND_TRANSACTION,
    data: { from: '0x123', nonce: 1 },
    account: '0x123',
  },
};

describe('useGasless', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAnalyticsContext).mockReturnValue({
      captureEncrypted: mockCaptureEncrypted,
      capture: jest.fn(),
      initAnalyticsIds: jest.fn(),
      isInitialized: true,
      stopDataCollection: jest.fn(),
    });
  });

  describe('tryFunding', () => {
    it('captures GaslessFundSuccessful when funding succeeds', async () => {
      const gaslessFundTx = jest.fn().mockResolvedValue('0xfundedHash');
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessFundTx,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(mockCaptureEncrypted).toHaveBeenCalledWith(
        'GaslessFundSuccessful',
        { fundTxHex: '0xfundedHash' },
      );
      expect(approveCallback).toHaveBeenCalledTimes(1);
    });

    it('does not capture event when fundTxHex is empty', async () => {
      const gaslessFundTx = jest.fn().mockResolvedValue(undefined);
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessFundTx,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(mockCaptureEncrypted).not.toHaveBeenCalledWith(
        'GaslessFundSuccessful',
        expect.anything(),
      );
      expect(approveCallback).toHaveBeenCalledTimes(1);
    });

    it('shows error toast and does not call approveCallback when funding throws', async () => {
      const gaslessFundTx = jest
        .fn()
        .mockRejectedValue(new Error('Gasless funding failed: SOME_ERROR'));
      const setGaslessDefaultValues = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessFundTx,
        setGaslessDefaultValues,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(toast.error).toHaveBeenCalledWith('Gasless funding failed');
      expect(setGaslessDefaultValues).toHaveBeenCalled();
      expect(approveCallback).not.toHaveBeenCalled();
      expect(mockCaptureEncrypted).not.toHaveBeenCalledWith(
        'GaslessFundSuccessful',
        expect.anything(),
      );
    });

    it('skips gasless funding when gasless is off', async () => {
      const gaslessFundTx = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        isGaslessOn: false,
        gaslessFundTx,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(gaslessFundTx).not.toHaveBeenCalled();
      expect(approveCallback).toHaveBeenCalledTimes(1);
    });

    it('skips gasless funding when not eligible', async () => {
      const gaslessFundTx = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        isGaslessEligible: false,
        gaslessFundTx,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(gaslessFundTx).not.toHaveBeenCalled();
      expect(approveCallback).toHaveBeenCalledTimes(1);
    });

    it('calls setGaslessDefaultValues after successful funding', async () => {
      const gaslessFundTx = jest.fn().mockResolvedValue('0xfundedHash');
      const setGaslessDefaultValues = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessFundTx,
        setGaslessDefaultValues,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));
      const approveCallback = jest.fn();

      await act(async () => {
        await result.current.tryFunding(approveCallback);
      });

      expect(approveCallback).toHaveBeenCalledTimes(1);
      expect(setGaslessDefaultValues).toHaveBeenCalled();
    });
  });

  describe('GaslessFundFailed analytics', () => {
    it('captures GaslessFundFailed when phase is ERROR', () => {
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessPhase: GaslessPhase.ERROR,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(mockCaptureEncrypted).toHaveBeenCalledWith('GaslessFundFailed');
    });

    it('does not capture GaslessFundFailed when phase is READY', () => {
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        gaslessPhase: GaslessPhase.READY,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(mockCaptureEncrypted).not.toHaveBeenCalledWith(
        'GaslessFundFailed',
      );
    });
  });

  describe('eligibility', () => {
    it('calls setGaslessEligibility for eip155 actions', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(setGaslessEligibility).toHaveBeenCalledWith(43114, '0x123', 1);
    });

    it('does not call setGaslessEligibility for non-eip155 actions', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      const nonEvmAction: Action<DisplayData> = {
        ...mockAction,
        scope: 'solana:mainnet',
        signingData: {
          type: RpcMethod.SOLANA_SIGN_TRANSACTION,
          data: 'serializedTx',
          account: '0x123',
        },
      };

      renderHook(() => useGasless({ action: nonEvmAction }));

      expect(setGaslessEligibility).not.toHaveBeenCalled();
    });

    it('does not call setGaslessEligibility when action has no scope', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      const noScopeAction = {
        ...mockAction,
        scope: '',
        signingData: {
          type: RpcMethod.ETH_SEND_TRANSACTION,
          data: { from: '0x123' },
          account: '0x123',
        },
      } satisfies Action<DisplayData>;

      renderHook(() => useGasless({ action: noScopeAction }));

      expect(setGaslessEligibility).not.toHaveBeenCalled();
    });

    it('does not call setGaslessEligibility when action has no signingData', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      const noSigningDataAction: Action<DisplayData> = {
        ...mockAction,
        scope: 'eip155:43114',
        signingData: undefined,
      };

      renderHook(() => useGasless({ action: noSigningDataAction }));

      expect(setGaslessEligibility).not.toHaveBeenCalled();
    });

    it('passes undefined for from and nonce when they are missing from ETH_SEND_TRANSACTION', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      const actionWithoutFromNonce: Action<DisplayData> = {
        ...mockAction,
        signingData: {
          type: RpcMethod.ETH_SEND_TRANSACTION,
          data: {},
          account: '0x123',
        },
      };

      renderHook(() => useGasless({ action: actionWithoutFromNonce }));

      expect(setGaslessEligibility).toHaveBeenCalledWith(
        43114,
        undefined,
        undefined,
      );
    });

    it('passes chainId with undefined from/nonce for non-ETH_SEND_TRANSACTION types', () => {
      const setGaslessEligibility = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        setGaslessEligibility,
      });

      const personalSignAction: Action<DisplayData> = {
        ...mockAction,
        signingData: {
          type: RpcMethod.PERSONAL_SIGN,
          data: '0x1234',
          account: '0x123',
        },
      };

      renderHook(() => useGasless({ action: personalSignAction }));

      expect(setGaslessEligibility).toHaveBeenCalledWith(
        43114,
        undefined,
        undefined,
      );
    });
  });

  describe('challenge fetching', () => {
    it('calls fetchAndSolveGaslessChallange when eligible and NOT_READY', () => {
      const fetchAndSolveGaslessChallange = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        isGaslessEligible: true,
        gaslessPhase: GaslessPhase.NOT_READY,
        fetchAndSolveGaslessChallange,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(fetchAndSolveGaslessChallange).toHaveBeenCalled();
    });

    it('does not call fetchAndSolveGaslessChallange when not eligible', () => {
      const fetchAndSolveGaslessChallange = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        isGaslessEligible: false,
        gaslessPhase: GaslessPhase.NOT_READY,
        fetchAndSolveGaslessChallange,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(fetchAndSolveGaslessChallange).not.toHaveBeenCalled();
    });

    it('does not call fetchAndSolveGaslessChallange when phase is READY', () => {
      const fetchAndSolveGaslessChallange = jest.fn();
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
        isGaslessEligible: true,
        gaslessPhase: GaslessPhase.READY,
        fetchAndSolveGaslessChallange,
      });

      renderHook(() => useGasless({ action: mockAction }));

      expect(fetchAndSolveGaslessChallange).not.toHaveBeenCalled();
    });
  });

  describe('return values', () => {
    it('returns all expected properties from useNetworkFeeContext plus tryFunding', () => {
      jest.mocked(useNetworkFeeContext).mockReturnValue({
        ...defaultNetworkFeeContext,
      });

      const { result } = renderHook(() => useGasless({ action: mockAction }));

      expect(result.current).toHaveProperty('isGaslessOn');
      expect(result.current).toHaveProperty('setIsGaslessOn');
      expect(result.current).toHaveProperty('gaslessFundTx');
      expect(result.current).toHaveProperty('fundTxHex');
      expect(result.current).toHaveProperty('setGaslessDefaultValues');
      expect(result.current).toHaveProperty('gaslessPhase');
      expect(result.current).toHaveProperty('setGaslessEligibility');
      expect(result.current).toHaveProperty('fetchAndSolveGaslessChallange');
      expect(result.current).toHaveProperty('isGaslessEligible');
      expect(result.current).toHaveProperty('tryFunding');
      expect(typeof result.current.tryFunding).toBe('function');
    });
  });
});
