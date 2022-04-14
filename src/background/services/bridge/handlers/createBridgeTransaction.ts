import { Big, isMainnetNetwork } from '@avalabs/avalanche-wallet-sdk';
import {
  BridgeTransaction,
  getMinimumConfirmations,
} from '@avalabs/bridge-sdk';
import {
  network$,
  wallet$,
  walletState$,
} from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { isWalletLocked } from '../../wallet/models';
import { bridge$, saveBridgeTransaction } from '../bridge';
import { bridgeConfig$ } from '../bridgeConfig';
import { trackBridgeTransaction } from '../trackBridgeTransaction';

export type PartialBridgeTransaction = Pick<
  BridgeTransaction,
  | 'sourceChain'
  | 'sourceTxHash'
  | 'sourceStartedAt'
  | 'targetChain'
  | 'amount'
  | 'symbol'
>;

/**
 * Add a new pending bridge transaction to the background state and start the
 * transaction tracking process.
 */
export async function createBridgeTransaction(
  request: ExtensionConnectionMessage
) {
  const partialBridgeTransaction = (request.params?.[0] ||
    {}) as PartialBridgeTransaction;
  const {
    sourceChain,
    sourceTxHash,
    sourceStartedAt,
    targetChain,
    amount: amountStr,
    symbol,
  } = partialBridgeTransaction;
  if (!sourceChain) return { ...request, error: 'missing sourceChain' };
  if (!sourceTxHash) return { ...request, error: 'missing sourceTxHash' };
  if (!sourceStartedAt) return { ...request, error: 'missing sourceStartedAt' };
  if (!targetChain) return { ...request, error: 'missing targetChain' };
  if (!amountStr) return { ...request, error: 'missing amount' };
  if (!symbol) return { ...request, error: 'missing symbol' };

  const { config } = await firstValueFrom(bridgeConfig$);
  if (!config) return { ...request, error: 'missing bridge config' };

  const bridgeState = await firstValueFrom(bridge$);
  const bridgeTransactions = bridgeState.bridgeTransactions;

  const network = await firstValueFrom(network$);
  const wallet = await firstValueFrom(wallet$);
  const walletState = await firstValueFrom(walletState$);
  if (!wallet || !walletState || isWalletLocked(walletState) || !network)
    return { ...request, error: 'wallet not ready' };

  if (bridgeTransactions[sourceTxHash])
    return { ...request, error: 'bridge tx already exists' };

  const addressC = walletState.addresses.addrC;
  const isMainnet = isMainnetNetwork(network.config);
  const addressBTC = wallet.getAddressBTC(isMainnet ? 'bitcoin' : 'testnet');
  const amount = new Big(amountStr);
  const requiredConfirmationCount = getMinimumConfirmations(
    sourceChain,
    config
  );

  const bridgeTransaction: BridgeTransaction = {
    /* from params */
    sourceChain,
    sourceTxHash,
    sourceStartedAt,
    targetChain,
    amount,
    symbol,
    /* new fields */
    addressC,
    addressBTC,
    complete: false,
    confirmationCount: 0,
    environment: isMainnet ? 'main' : 'test',
    requiredConfirmationCount,
  };

  // Save the initial version
  const error = await saveBridgeTransaction(bridgeTransaction);

  // Start transaction tracking process (no need to await)
  trackBridgeTransaction(bridgeTransaction, config);

  if (error) {
    return {
      ...request,
      error,
    };
  }

  return {
    ...request,
    result: true,
  };
}

export const CreateBridgeTransactionStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_TRANSACTION_CREATE, createBridgeTransaction];
