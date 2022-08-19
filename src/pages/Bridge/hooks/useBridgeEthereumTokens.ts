import { Blockchain, useBridgeSDK } from '@avalabs/bridge-sdk';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

export function useBridgeEthereumTokens() {
  const { bridgeConfig } = useBridgeSDK();

  return useTokensWithBalances(
    true,
    bridgeConfig?.config?.critical.networks[Blockchain.ETHEREUM]
  );
}
