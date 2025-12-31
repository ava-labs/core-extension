import { renderHook } from '@testing-library/react-hooks';
import { ChainId } from '@avalabs/core-chains-sdk';
import { Account, AccountType, FeatureGates } from '@core/types';
import {
  useIsFunctionAvailable,
  FunctionNames,
} from './useIsFunctionAvailable';
import { useAccountsContext } from '../contexts';
import { useFeatureFlagContext } from '../contexts';
import { useNetworkContext } from '../contexts';
import { useIsUsingSeedlessAccount } from './useIsUsingSeedlessAccount';
import * as commonUtils from '@core/common';

jest.mock('../contexts', () => ({
  useAccountsContext: jest.fn(),
  useFeatureFlagContext: jest.fn(),
  useNetworkContext: jest.fn(),
}));

jest.mock('./useIsUsingSeedlessAccount', () => ({
  useIsUsingSeedlessAccount: jest.fn(),
}));

jest.mock('@core/common', () => ({
  ...jest.requireActual('@core/common'),
  isAvalancheNetwork: jest.fn(),
  isBitcoinNetwork: jest.fn(),
  isEthereumNetwork: jest.fn(),
  isPchainNetwork: jest.fn(),
  isXchainNetwork: jest.fn(),
  isSolanaNetwork: jest.fn(),
}));

describe('hooks/useIsFunctionAvailable', () => {
  const mockAccount: Account = {
    id: 'test-account-id',
    name: 'Test Account',
    type: AccountType.PRIMARY,
    addressC: '0x123',
    addressAVM: '0x456',
    addressPVM: '0x789',
    addressBTC: 'bc1qtest',
    addressSVM: 'test-solana-address',
  } as Account;

  const mockNetwork = {
    chainId: ChainId.AVALANCHE_MAINNET_ID,
    caipId: 'eip155:43114',
  };

  const mockFeatureFlags = {
    [FeatureGates.BRIDGE]: true,
    [FeatureGates.SEND]: true,
    [FeatureGates.SWAP]: true,
    [FeatureGates.BUY]: true,
    [FeatureGates.DEFI]: true,
    [FeatureGates.KEYSTONE]: true,
    [FeatureGates.SEEDLESS_SIGNING]: true,
    [FeatureGates.SEND_P_CHAIN]: true,
    [FeatureGates.SEND_X_CHAIN]: true,
    [FeatureGates.SWAP_ETHEREUM]: true,
    [FeatureGates.SWAP_C_CHAIN]: true,
    [FeatureGates.SWAP_SOLANA]: true,
    [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
  } as any;

  const mockIsFlagEnabled = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    // Set up mockIsFlagEnabled implementation
    mockIsFlagEnabled.mockImplementation((flag: FeatureGates) => {
      return mockFeatureFlags[flag] ?? false;
    });

    (useNetworkContext as jest.Mock).mockReturnValue({
      network: mockNetwork,
    });

    (useAccountsContext as jest.Mock).mockReturnValue({
      accounts: {
        active: mockAccount,
      },
    });

    (useFeatureFlagContext as jest.Mock).mockReturnValue({
      isFlagEnabled: mockIsFlagEnabled,
      featureFlags: mockFeatureFlags,
    });

    (useIsUsingSeedlessAccount as jest.Mock).mockReturnValue(false);

    // Mock network helpers
    jest
      .mocked(commonUtils.isAvalancheNetwork)
      .mockImplementation((network) => {
        if (!network) return false;
        return [
          ChainId.AVALANCHE_MAINNET_ID,
          ChainId.AVALANCHE_TESTNET_ID,
        ].includes(network.chainId);
      });
    jest.mocked(commonUtils.isBitcoinNetwork).mockImplementation((network) => {
      if (!network) return false;
      return [ChainId.BITCOIN, ChainId.BITCOIN_TESTNET].includes(
        network.chainId,
      );
    });
    jest.mocked(commonUtils.isEthereumNetwork).mockImplementation((network) => {
      if (!network) return false;
      return network.chainId === ChainId.ETHEREUM_HOMESTEAD;
    });
    jest.mocked(commonUtils.isPchainNetwork).mockImplementation((network) => {
      if (!network) return false;
      return [ChainId.AVALANCHE_P, ChainId.AVALANCHE_TEST_P].includes(
        network.chainId,
      );
    });
    jest.mocked(commonUtils.isXchainNetwork).mockImplementation((network) => {
      if (!network) return false;
      return [ChainId.AVALANCHE_X, ChainId.AVALANCHE_TEST_X].includes(
        network.chainId,
      );
    });
    jest.mocked(commonUtils.isSolanaNetwork).mockImplementation((network) => {
      if (!network) return false;
      return [
        ChainId.SOLANA_MAINNET_ID,
        ChainId.SOLANA_TESTNET_ID,
        ChainId.SOLANA_DEVNET_ID,
      ].includes(network.chainId);
    });
  });

  describe('isReady', () => {
    it('returns false when network is not available', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: undefined,
      });

      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(result.current.isReady).toBe(false);
    });

    it('returns false when active account is not available', () => {
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: undefined,
        },
      });

      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(result.current.isReady).toBe(false);
    });

    it('returns true when both network and account are available', () => {
      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(result.current.isReady).toBe(true);
    });
  });

  describe('when functionName is not provided', () => {
    it('returns false for isFunctionAvailable and isFunctionSupported', () => {
      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(result.current.isFunctionAvailable).toBe(false);
      expect(result.current.isFunctionSupported).toBe(false);
      expect(result.current.isReady).toBe(true);
      expect(typeof result.current.checkIsFunctionAvailable).toBe('function');
      expect(typeof result.current.checkIsFunctionSupported).toBe('function');
    });
  });

  describe('checkIsFunctionAvailable - Feature Flag Checks', () => {
    it('returns true when feature flag is enabled for BRIDGE', () => {
      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.BRIDGE);
    });

    it('returns false when feature flag is disabled for BRIDGE', () => {
      mockIsFlagEnabled.mockReturnValueOnce(false);

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns true when feature flag is enabled for BUY', () => {
      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BUY }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });

    it('returns true when feature flag is enabled for DEFI', () => {
      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.DEFI }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });

    it('returns true when feature flag is enabled for KEYSTONE', () => {
      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.KEYSTONE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });

    it('returns true for functions without feature flag mapping', () => {
      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.RECEIVE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });
  });

  describe('checkIsFunctionAvailable - Seedless Account Checks', () => {
    beforeEach(() => {
      (useIsUsingSeedlessAccount as jest.Mock).mockReturnValue(true);
    });

    it('returns false for signing functions when seedless signing is disabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.SEEDLESS_SIGNING) return false;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result: bridgeResult } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );
      expect(bridgeResult.current.isFunctionAvailable).toBe(false);

      const { result: sendResult } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );
      expect(sendResult.current.isFunctionAvailable).toBe(false);

      const { result: swapResult } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );
      expect(swapResult.current.isFunctionAvailable).toBe(false);

      const { result: signResult } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SIGN }),
      );
      expect(signResult.current.isFunctionAvailable).toBe(false);
    });

    it('returns true for signing functions when seedless signing is enabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.SEEDLESS_SIGNING) return true;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });

    it('returns true for non-signing functions even when seedless signing is disabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.SEEDLESS_SIGNING) return false;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.RECEIVE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });
  });

  describe('checkIsFunctionAvailable - SEND function', () => {
    it('returns true for P-chain when addressPVM exists and flags are enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SEND);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SEND_P_CHAIN);
    });

    it('returns false for P-chain when addressPVM is missing', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: { ...mockAccount, addressPVM: undefined },
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns false for P-chain when SEND_P_CHAIN flag is disabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });
      const mockIsFlagEnabledDisabled = jest.fn((flag: FeatureGates) => {
        if (flag === FeatureGates.SEND_P_CHAIN) return false;
        return mockFeatureFlags[flag] ?? false;
      });
      (useFeatureFlagContext as jest.Mock).mockReturnValue({
        isFlagEnabled: mockIsFlagEnabledDisabled,
        featureFlags: mockFeatureFlags,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns true for X-chain when addressAVM exists and flags are enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_X },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SEND);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SEND_X_CHAIN);
    });

    it('returns false for X-chain when addressAVM is missing', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_X },
      });
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: { ...mockAccount, addressAVM: undefined },
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });
  });

  describe('checkIsFunctionAvailable - SWAP function', () => {
    it('returns false when network is not available', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: undefined,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns false when SWAP feature flag is disabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.SWAP) return false;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns true for Ethereum network when SWAP_ETHEREUM flag is enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.ETHEREUM_HOMESTEAD },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SWAP);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(
        FeatureGates.SWAP_ETHEREUM,
      );
    });

    it('returns true for Avalanche network when SWAP_C_CHAIN flag is enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SWAP);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SWAP_C_CHAIN);
    });

    it('returns true for Solana network when SWAP_SOLANA flag is enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.SOLANA_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SWAP);
      expect(mockIsFlagEnabled).toHaveBeenCalledWith(FeatureGates.SWAP_SOLANA);
    });

    it('returns false for unsupported network', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });
  });

  describe('checkIsFunctionAvailable - BRIDGE function', () => {
    it('returns false when network is not available', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: undefined,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns false when BRIDGE feature flag is disabled', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.BRIDGE) return false;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns true for Bitcoin network when UNIFIED_BRIDGE_AB_BTC_TO_AVA is enabled', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });
      (useFeatureFlagContext as jest.Mock).mockReturnValue({
        isFlagEnabled: mockIsFlagEnabled,
        featureFlags: {
          ...mockFeatureFlags,
          [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: true,
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });

    it('returns false for Bitcoin network when UNIFIED_BRIDGE_AB_BTC_TO_AVA is disabled', () => {
      const testFeatureFlags = {
        ...mockFeatureFlags,
        [FeatureGates.UNIFIED_BRIDGE_AB_BTC_TO_AVA]: false,
      };

      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });
      (useFeatureFlagContext as jest.Mock).mockReturnValue({
        isFlagEnabled: (flag: FeatureGates) => testFeatureFlags[flag] ?? false,
        featureFlags: testFeatureFlags,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(false);
    });

    it('returns true for non-Bitcoin networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });
      (useFeatureFlagContext as jest.Mock).mockReturnValue({
        isFlagEnabled: mockIsFlagEnabled,
        featureFlags: mockFeatureFlags,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionAvailable).toBe(true);
    });
  });

  describe('checkIsFunctionSupported - Network Whitelist', () => {
    it('returns true for COLLECTIBLES on whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.COLLECTIBLES }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });

    it('returns false for COLLECTIBLES on non-whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.COLLECTIBLES }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns true for Swap on whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });

    it('returns false for Swap on non-whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SWAP }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns true for Buy on whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BUY }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });

    it('returns false for Buy on non-whitelisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BUY }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });
  });

  describe('checkIsFunctionSupported - Network Blacklist', () => {
    it('returns false for ManageTokens on blacklisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.MANAGE_TOKEN }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns false for ManageCollectibles on blacklisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({
          functionName: FunctionNames.MANAGE_COLLECTIBLES,
        }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns false for Bridge on blacklisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns true for Bridge on non-blacklisted networks', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_MAINNET_ID },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.BRIDGE }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });
  });

  describe('checkIsFunctionSupported - SEND on P/X chain', () => {
    it('returns false for SEND on P-chain when addressPVM is missing', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: { ...mockAccount, addressPVM: undefined },
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns false for SEND on X-chain when addressAVM is missing', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_X },
      });
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: { ...mockAccount, addressAVM: undefined },
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns true for SEND on P-chain when addressPVM exists', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_P },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });

    it('returns true for SEND on X-chain when addressAVM exists', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.AVALANCHE_X },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.SEND }),
      );

      expect(result.current.isFunctionSupported).toBe(true);
    });
  });

  describe('checkIsFunctionSupported - Account Support Checks', () => {
    it('returns false when network is not available', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: undefined,
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.RECEIVE }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });

    it('returns false when active account is not available', () => {
      (useAccountsContext as jest.Mock).mockReturnValue({
        accounts: {
          active: undefined,
        },
      });

      const { result } = renderHook(() =>
        useIsFunctionAvailable({ functionName: FunctionNames.RECEIVE }),
      );

      expect(result.current.isFunctionSupported).toBe(false);
    });
  });

  describe('checkIsFunctionAvailable and checkIsFunctionSupported helpers', () => {
    it('checkIsFunctionAvailable can be called directly', () => {
      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(
        result.current.checkIsFunctionAvailable(FunctionNames.BRIDGE),
      ).toBe(true);
    });

    it('checkIsFunctionSupported can be called directly', () => {
      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(
        result.current.checkIsFunctionSupported(FunctionNames.BRIDGE),
      ).toBe(true);
    });

    it('checkIsFunctionAvailable respects feature flags when called directly', () => {
      mockIsFlagEnabled.mockImplementation((flag) => {
        if (flag === FeatureGates.BRIDGE) return false;
        return mockFeatureFlags[flag] ?? false;
      });

      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(
        result.current.checkIsFunctionAvailable(FunctionNames.BRIDGE),
      ).toBe(false);
    });

    it('checkIsFunctionSupported respects network whitelist when called directly', () => {
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      const { result } = renderHook(() => useIsFunctionAvailable({}));

      expect(
        result.current.checkIsFunctionSupported(FunctionNames.COLLECTIBLES),
      ).toBe(false);
    });
  });

  describe('network parameter override', () => {
    it('uses the provided network parameter instead of active network from context', () => {
      // Set context to Bitcoin (where swap is NOT supported)
      (useNetworkContext as jest.Mock).mockReturnValue({
        network: { chainId: ChainId.BITCOIN },
      });

      // But pass Avalanche as the network parameter (where swap IS supported)
      const { result } = renderHook(() =>
        useIsFunctionAvailable({
          functionName: FunctionNames.SWAP,
          network: {
            chainId: ChainId.AVALANCHE_MAINNET_ID,
            caipId: 'eip155:43114',
          } as any,
        }),
      );

      // Should use the passed network (Avalanche), not the context network (Bitcoin)
      expect(result.current.isFunctionAvailable).toBe(true);
      expect(result.current.isFunctionSupported).toBe(true);
    });
  });
});
