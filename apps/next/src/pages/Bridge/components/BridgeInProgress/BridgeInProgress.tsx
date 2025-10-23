import {
  BridgeTransfer,
  BridgeType,
  Environment,
  TokenType,
} from '@avalabs/bridge-unified';
import { FC } from 'react';
import { useBridgeState } from '../../contexts';
import { BridgeDetails } from './components';

// TODO: remove this before merging
const TEST_TRANSFER: BridgeTransfer = {
  type: BridgeType.AVALANCHE_EVM,
  environment: Environment.PROD,
  fromAddress: '0xSourceAddress',
  toAddress: '0xTargetAddress',
  amount: 100000000n,
  sourceNetworkFee: 100000000n,
  targetNetworkFee: 100000000n,
  sourceRequiredConfirmationCount: 6,
  targetRequiredConfirmationCount: 2,
  sourceConfirmationCount: 1,
  targetConfirmationCount: 2,
  asset: {
    type: TokenType.NATIVE,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    destinations: {
      'eip155:10': [],
    },
  },
  bridgeFee: 0n,
  sourceChain: {
    chainName: '',
    chainId: '',
    rpcUrl: '',
    utilityAddresses: undefined,
    networkToken: {
      type: TokenType.NATIVE,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  sourceStartedAt: 0,
  sourceTxHash: '',
  targetChain: {
    chainName: '',
    chainId: '',
    rpcUrl: '',
    utilityAddresses: undefined,
    networkToken: {
      type: TokenType.NATIVE,
      name: 'Optimism',
      symbol: 'OP',
      decimals: 18,
    },
  },
};

export const BridgeInProgress: FC = () => {
  const {
    query: { transactionId },
    state: { pendingTransfers },
  } = useBridgeState();

  const pendingTransfer = pendingTransfers[transactionId] ?? TEST_TRANSFER;
  if (!pendingTransfer) {
    return <>😕</>;
  }
  return (
    <>
      <BridgeDetails
        type="source"
        chain={pendingTransfer.sourceChain}
        fee={pendingTransfer.sourceNetworkFee ?? 0n}
        confirmationsRequired={pendingTransfer.sourceRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.sourceConfirmationCount}
      />
      <BridgeDetails
        type="target"
        chain={pendingTransfer.targetChain}
        fee={pendingTransfer.targetNetworkFee ?? 0n}
        confirmationsRequired={pendingTransfer.targetRequiredConfirmationCount}
        confirmationsReceived={pendingTransfer.targetConfirmationCount}
      />
    </>
  );
};
