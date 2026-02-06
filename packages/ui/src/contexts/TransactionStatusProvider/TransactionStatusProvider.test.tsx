import { render } from '@shared/tests/test-utils';
import { Subject } from 'rxjs';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { toast } from '@avalabs/k2-alpine';
import {
  ContextContainer,
  TransactionStatusEvents,
  NetworkWithCaipId,
} from '@core/types';
import { TransactionStatusProvider } from './TransactionStatusProvider';
import { useConnectionContext } from '../ConnectionProvider';
import { useNetworkContext } from '../NetworkProvider';
import { isSpecificContextContainer } from '../../utils';

jest.mock('@avalabs/k2-alpine', () => ({
  toast: {
    pending: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
  })),
}));

jest.mock('../ConnectionProvider', () => ({
  useConnectionContext: jest.fn(),
}));

jest.mock('../NetworkProvider', () => ({
  useNetworkContext: jest.fn(),
}));

jest.mock('../../utils', () => ({
  isSpecificContextContainer: jest.fn(),
}));

jest.mock('@core/common', () => ({
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

describe('TransactionStatusProvider', () => {
  let eventSubject: Subject<any>;
  const mockGetNetwork = jest.fn();
  const mockOnPending = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnReverted = jest.fn();
  const mockRenderExplorerLink = jest.fn();

  const ethereumNetwork = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
  const avalancheCChain = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
  const avalanchePChain = createMockNetwork(
    ChainId.AVALANCHE_P,
    NetworkVMType.PVM,
  );
  const avalancheXChain = createMockNetwork(
    ChainId.AVALANCHE_X,
    NetworkVMType.AVM,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    eventSubject = new Subject();

    jest
      .mocked<
        () => Partial<ReturnType<typeof useConnectionContext>>
      >(useConnectionContext)
      .mockReturnValue({
        events: () => eventSubject,
      });

    jest
      .mocked<
        () => Partial<ReturnType<typeof useNetworkContext>>
      >(useNetworkContext)
      .mockReturnValue({
        getNetwork: mockGetNetwork,
      });

    // Default to allowed context
    jest
      .mocked(isSpecificContextContainer)
      .mockImplementation(
        (context: ContextContainer) =>
          context === ContextContainer.POPUP ||
          context === ContextContainer.SIDE_PANEL,
      );

    mockRenderExplorerLink.mockReturnValue(<span>Explorer Link</span>);
  });

  const renderProvider = () => {
    return render(
      <TransactionStatusProvider
        onPending={mockOnPending}
        onSuccess={mockOnSuccess}
        onReverted={mockOnReverted}
        renderExplorerLink={mockRenderExplorerLink}
      >
        <div>Test Child</div>
      </TransactionStatusProvider>,
    );
  };

  describe('context restrictions', () => {
    it('does not subscribe to events in disallowed contexts', () => {
      jest.mocked(isSpecificContextContainer).mockReturnValue(false);

      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(mockOnPending).not.toHaveBeenCalled();
      expect(toast.pending).not.toHaveBeenCalled();
    });

    it('subscribes to events in POPUP context', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(mockOnPending).toHaveBeenCalled();
    });
  });

  describe('PENDING event', () => {
    it('calls onPending callback with network and context', () => {
      renderProvider();

      const txHash = '0x123';
      const context = { someData: 'test' };
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'eip155:1', context },
      });

      expect(mockOnPending).toHaveBeenCalledWith({
        network: ethereumNetwork,
        context,
      });
    });

    it('shows pending toast for non-Avalanche networks', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(toast.pending).toHaveBeenCalledWith('Transaction pending...', {
        id: `transaction-pending-${txHash}`,
      });
    });

    it('shows success toast immediately for Avalanche C-Chain', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalancheCChain);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'eip155:43114' },
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Transaction successful',
        expect.objectContaining({
          id: `transaction-success-${txHash}`,
        }),
      );
      expect(toast.pending).not.toHaveBeenCalled();
    });

    it('shows success toast immediately for Avalanche P-Chain', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalanchePChain);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'avax:p-chain' },
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Transaction successful',
        expect.objectContaining({
          id: `transaction-success-${txHash}`,
        }),
      );
      expect(toast.pending).not.toHaveBeenCalled();
    });

    it('shows success toast immediately for Avalanche X-Chain', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalancheXChain);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: { txHash, chainId: 'avax:x-chain' },
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Transaction successful',
        expect.objectContaining({
          id: `transaction-success-${txHash}`,
        }),
      );
      expect(toast.pending).not.toHaveBeenCalled();
    });

    it('skips for intermediate transactions', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: {
          txHash,
          chainId: 'eip155:1',
          context: { isIntermediateTransaction: true },
        },
      });

      expect(mockOnPending).not.toHaveBeenCalled();
      expect(toast.pending).not.toHaveBeenCalled();
    });

    it('skips for bridge transactions', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.PENDING,
        value: {
          txHash,
          chainId: 'eip155:1',
          context: { isBridge: true },
        },
      });

      expect(mockOnPending).not.toHaveBeenCalled();
      expect(toast.pending).not.toHaveBeenCalled();
    });
  });

  describe('CONFIRMED event', () => {
    it('dismisses pending toast and shows success toast for non-Avalanche networks', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(toast.dismiss).toHaveBeenCalledWith(
        `transaction-pending-${txHash}`,
      );
      expect(toast.success).toHaveBeenCalledWith(
        'Transaction successful',
        expect.objectContaining({
          id: `transaction-success-${txHash}`,
        }),
      );
    });

    it('calls onSuccess callback with network and context', () => {
      renderProvider();

      const txHash = '0x123';
      const context = { someData: 'test' };
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'eip155:1', context },
      });

      expect(mockOnSuccess).toHaveBeenCalledWith({
        network: ethereumNetwork,
        context,
      });
    });

    it('skips for Avalanche C-Chain (already shown on pending)', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalancheCChain);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'eip155:43114' },
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('skips for Avalanche P-Chain (already shown on pending)', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalanchePChain);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'avax:p-chain' },
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('skips for Avalanche X-Chain (already shown on pending)', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(avalancheXChain);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'avax:x-chain' },
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('skips for intermediate transactions', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: {
          txHash,
          chainId: 'eip155:1',
          context: { isIntermediateTransaction: true },
        },
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('skips for bridge transactions', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: {
          txHash,
          chainId: 'eip155:1',
          context: { isBridge: true },
        },
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('REVERTED event', () => {
    it('dismisses pending toast and shows error toast', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.REVERTED,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(toast.dismiss).toHaveBeenCalledWith(
        `transaction-pending-${txHash}`,
      );
      expect(toast.dismiss).toHaveBeenCalledWith(
        `transaction-success-${txHash}`,
      );
      expect(toast.error).toHaveBeenCalledWith('Transaction failed', {
        id: `transaction-failure-${txHash}`,
      });
    });

    it('calls onReverted callback with network and context', () => {
      renderProvider();

      const txHash = '0x123';
      const context = { someData: 'test' };
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.REVERTED,
        value: { txHash, chainId: 'eip155:1', context },
      });

      expect(mockOnReverted).toHaveBeenCalledWith({
        network: ethereumNetwork,
        context,
      });
    });
  });

  describe('explorer link', () => {
    it('includes explorer link in success toast when renderExplorerLink is provided', () => {
      renderProvider();

      const txHash = '0x123';
      mockGetNetwork.mockReturnValue(ethereumNetwork);

      eventSubject.next({
        name: TransactionStatusEvents.CONFIRMED,
        value: { txHash, chainId: 'eip155:1' },
      });

      expect(mockRenderExplorerLink).toHaveBeenCalledWith(
        expect.objectContaining({
          network: ethereumNetwork,
          hash: txHash,
        }),
      );
    });
  });

  describe('cleanup', () => {
    it('unsubscribes from events on unmount', () => {
      const { unmount } = renderProvider();

      unmount();

      // The subscription should be cleaned up
      expect(eventSubject.observed).toBe(false);
    });
  });

  describe('chain-specific toast behavior', () => {
    describe('Avalanche primary networks (C/X/P chains)', () => {
      it.each([
        { name: 'C-Chain', network: avalancheCChain, chainId: 'eip155:43114' },
        { name: 'P-Chain', network: avalanchePChain, chainId: 'avax:p-chain' },
        { name: 'X-Chain', network: avalancheXChain, chainId: 'avax:x-chain' },
      ])(
        '$name: shows success toast on PENDING and skips on CONFIRMED',
        ({ network, chainId }) => {
          renderProvider();
          const txHash = '0xabc';
          mockGetNetwork.mockReturnValue(network);

          // PENDING event
          eventSubject.next({
            name: TransactionStatusEvents.PENDING,
            value: { txHash, chainId },
          });

          expect(toast.success).toHaveBeenCalledWith(
            'Transaction successful',
            expect.objectContaining({ id: `transaction-success-${txHash}` }),
          );
          expect(toast.pending).not.toHaveBeenCalled();
          expect(mockOnPending).toHaveBeenCalledWith({
            network,
            context: undefined,
          });

          jest.clearAllMocks();

          // CONFIRMED event
          eventSubject.next({
            name: TransactionStatusEvents.CONFIRMED,
            value: { txHash, chainId },
          });

          // Should NOT show another success toast (already shown on pending)
          expect(toast.success).not.toHaveBeenCalled();
          expect(mockOnSuccess).not.toHaveBeenCalled();
        },
      );
    });

    describe('non-Avalanche networks (Ethereum, etc.)', () => {
      it('shows pending toast on PENDING and success toast on CONFIRMED', () => {
        renderProvider();
        const txHash = '0xdef';
        mockGetNetwork.mockReturnValue(ethereumNetwork);

        // PENDING event
        eventSubject.next({
          name: TransactionStatusEvents.PENDING,
          value: { txHash, chainId: 'eip155:1' },
        });

        expect(toast.pending).toHaveBeenCalledWith('Transaction pending...', {
          id: `transaction-pending-${txHash}`,
        });
        expect(toast.success).not.toHaveBeenCalled();
        expect(mockOnPending).toHaveBeenCalledWith({
          network: ethereumNetwork,
          context: undefined,
        });

        jest.clearAllMocks();

        // CONFIRMED event
        eventSubject.next({
          name: TransactionStatusEvents.CONFIRMED,
          value: { txHash, chainId: 'eip155:1' },
        });

        expect(toast.dismiss).toHaveBeenCalledWith(
          `transaction-pending-${txHash}`,
        );
        expect(toast.success).toHaveBeenCalledWith(
          'Transaction successful',
          expect.objectContaining({ id: `transaction-success-${txHash}` }),
        );
        expect(mockOnSuccess).toHaveBeenCalledWith({
          network: ethereumNetwork,
          context: undefined,
        });
      });
    });
  });
});
