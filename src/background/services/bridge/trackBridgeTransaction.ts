import {
  AppConfig,
  BridgeTransaction,
  trackBridgeTransaction as trackBridgeTransactionSDK,
} from '@avalabs/bridge-sdk';
import { getAvalancheProvider } from '../network/getAvalancheProvider';
import { FUJI_NETWORK, MAINNET_NETWORK } from '../network/models';
import { saveBridgeTransaction } from './bridge';
import { getEthereumProvider } from './getEthereumProvider';

export async function trackBridgeTransaction(
  bridgeTransaction: BridgeTransaction,
  config: AppConfig
) {
  const network =
    bridgeTransaction.environment === 'main' ? MAINNET_NETWORK : FUJI_NETWORK;
  const avalancheProvider = getAvalancheProvider(network);
  const ethereumProvider = getEthereumProvider(network);

  trackBridgeTransactionSDK({
    bridgeTransaction,
    onBridgeTransactionUpdate: saveBridgeTransaction,
    config,
    avalancheProvider,
    ethereumProvider,
  });
}
