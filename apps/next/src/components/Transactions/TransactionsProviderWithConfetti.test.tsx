import { render, screen } from '@shared/tests/test-utils';
import { ChainId, NetworkVMType } from '@avalabs/core-chains-sdk';
import { NetworkWithCaipId } from '@core/types';
import { TransactionStatusProviderWithConfetti } from './TransactionsProviderWithConfetti';

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
  TransactionStatusProvider: ({
    children,
    onPending,
    onSuccess,
  }: {
    children: React.ReactNode;
    onPending?: (params: { network?: NetworkWithCaipId }) => void;
    onSuccess?: (params: { network?: NetworkWithCaipId }) => void;
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
      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );
    });

    it('navigates to home on pending', () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      capturedOnPending?.({ network });

      expect(mockHistoryReplace).toHaveBeenCalledWith('/');
    });

    it('triggers confetti for Avalanche C-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
      capturedOnPending?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('triggers confetti for Avalanche P-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM);
      capturedOnPending?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('triggers confetti for Avalanche X-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM);
      capturedOnPending?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('does not trigger confetti for Ethereum network', () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      capturedOnPending?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti for Bitcoin network', () => {
      const network = createMockNetwork(ChainId.BITCOIN);
      capturedOnPending?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti when network is undefined', () => {
      capturedOnPending?.({ network: undefined });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });
  });

  describe('handleSuccess', () => {
    beforeEach(() => {
      render(
        <TransactionStatusProviderWithConfetti>
          <div>Test</div>
        </TransactionStatusProviderWithConfetti>,
      );
    });

    it('triggers confetti for Ethereum network', () => {
      const network = createMockNetwork(ChainId.ETHEREUM_HOMESTEAD);
      capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('triggers confetti for Bitcoin network', () => {
      const network = createMockNetwork(ChainId.BITCOIN);
      capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });

    it('does not trigger confetti for Avalanche C-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_MAINNET_ID);
      capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti for Avalanche P-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_P, NetworkVMType.PVM);
      capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('does not trigger confetti for Avalanche X-Chain', () => {
      const network = createMockNetwork(ChainId.AVALANCHE_X, NetworkVMType.AVM);
      capturedOnSuccess?.({ network });

      expect(mockTriggerConfetti).not.toHaveBeenCalled();
    });

    it('triggers confetti when network is undefined (non-Avalanche default)', () => {
      capturedOnSuccess?.({ network: undefined });

      expect(mockTriggerConfetti).toHaveBeenCalledTimes(1);
    });
  });
});
