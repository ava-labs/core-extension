import { render, screen } from '@shared/tests/test-utils';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';
import { TransactionStatusProviderWithConfetti } from './TransactionsProviderWithConfetti';
import { useIsOptimisticConfirmationEnabled } from '@core/ui';

const mockTriggerConfetti = jest.fn();
const mockHistoryReplace = jest.fn();
let capturedOnPending:
  | ((params: { network?: NetworkWithCaipId }) => void)
  | undefined;
let capturedOnSuccess:
  | ((params: { network?: NetworkWithCaipId }) => void)
  | undefined;

jest.mock('@/components/Confetti', () => ({
  useConfettiContext: () => ({
    triggerConfetti: mockTriggerConfetti,
  }),
}));

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

jest.mock('@core/ui', () => ({
  useIsOptimisticConfirmationEnabled: jest.fn(),
  TransactionStatusProvider: ({
    children,
    onPending,
    onSuccess,
  }: {
    children: React.ReactNode;
    onPending?: (params: { network?: NetworkWithCaipId }) => Promise<void>;
    onSuccess?: (params: { network?: NetworkWithCaipId }) => Promise<void>;
  }) => {
    capturedOnPending = onPending;
    capturedOnSuccess = onSuccess;
    return <div data-testid="transaction-status-provider">{children}</div>;
  },
  TransactionStatusCallbackParams: {},
}));

jest.mock('@core/common', () => ({
  openNewTab: jest.fn(),
  getExplorerAddressByNetwork: jest.fn(),
  isAvalanchePrimaryNetwork: jest.fn((network?: NetworkWithCaipId) => {
    if (!network) return false;
    return [
      ChainId.AVALANCHE_MAINNET_ID,
      ChainId.AVALANCHE_TESTNET_ID,
      ChainId.AVALANCHE_P,
      ChainId.AVALANCHE_TEST_P,
      ChainId.AVALANCHE_X,
      ChainId.AVALANCHE_TEST_X,
    ].includes(network.chainId);
  }),
}));

const createMockNetwork = (
  chainId: number,
  vmName: NetworkVMType = NetworkVMType.EVM,
): NetworkWithCaipId => ({
  chainName: 'test',
  chainId,
  vmName,
  rpcUrl: 'rpcUrl',
  explorerUrl: 'https://explorer.url',
  networkToken: {
    name: 'networkTokenName',
    symbol: 'TEST',
    description: 'networkToken description',
    decimals: 18,
    logoUri: 'networkToken.logo.uri',
  },
  logoUri: 'logoUri',
  caipId: `eip155:${chainId}`,
});

describe('TransactionStatusProviderWithConfetti', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnPending = undefined;
    capturedOnSuccess = undefined;
  });

  it('renders children inside TransactionStatusProvider', () => {
    render(
      <TransactionStatusProviderWithConfetti>
        <div>Test Child</div>
      </TransactionStatusProviderWithConfetti>,
    );

    expect(screen.getByText('Test Child')).toBeDefined();
  });

  describe('handlePending', () => {
    beforeEach(() => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(false));

      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );
    });

    it('navigates to home on pending', async () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      await capturedOnPending?.({ network });

      expect(mockHistoryReplace).toHaveBeenCalledWith('/');
    });

    it('triggers confetti for Avalanche primary chains before Helicon is enabled', async () => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(true));

      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_MAINNET_ID),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(2);

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM),
      });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(3);
    });

    it('does not trigger confetti for Avalanche primary chains after Helicon is enabled', async () => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(false));

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_MAINNET_ID),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);

      await capturedOnPending?.({
        network: createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM),
      });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);
    });

    it('does not trigger confetti for Ethereum network', async () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      await capturedOnPending?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti for Bitcoin network', async () => {
      const network = createMockNetwork(ChainId.BITCOIN);
      await capturedOnPending?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti when network is undefined', async () => {
      await capturedOnPending?.({ network: undefined });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });
  });

  describe('handleSuccess', () => {
    beforeEach(() => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(false));
      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );
    });

    it('triggers confetti for Ethereum network', async () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      await capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('triggers confetti for Bitcoin network', async () => {
      const network = createMockNetwork(ChainId.BITCOIN);
      await capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('triggers confetti for Avalanche primary chains after Helicon is enabled', async () => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(false));

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_MAINNET_ID),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(2);

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM),
      });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(3);
    });

    it('does not trigger confetti for Avalanche primary chains before Helicon is enabled', async () => {
      jest
        .mocked(useIsOptimisticConfirmationEnabled)
        .mockReturnValue(() => Promise.resolve(true));

      // Gotta re-render the component to update the mock
      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_MAINNET_ID),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM),
      });
      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);

      await capturedOnSuccess?.({
        network: createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM),
      });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(0);
    });

    it('triggers confetti when network is undefined (non-Avalanche default)', async () => {
      await capturedOnSuccess?.({ network: undefined });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });
  });
});
