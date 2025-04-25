import { BridgeTransfer } from '@avalabs/bridge-unified';
import { Blockchain, BridgeTransaction } from '@avalabs/core-bridge-sdk';
import { ChainId } from '@avalabs/core-chains-sdk';

import { useNetworkContext } from '@/contexts/NetworkProvider';
import { useTokensWithBalances } from '@/hooks/useTokensWithBalances';

import {
  caipToChainId,
  findTokenForAsset,
  getBridgedAssetSymbol,
  networkToBlockchain,
} from '@core/utils';

export function useLogoUriForBridgeTransaction(
  bridgeTransaction: BridgeTransaction | BridgeTransfer | undefined,
): string | undefined {
  const { network, networks, getNetwork } = useNetworkContext();

  const isMainnet = !network?.isTestnet;
  const isUnifiedTransfer = typeof bridgeTransaction?.sourceChain === 'object';
  const targetBlockchain = isUnifiedTransfer
    ? networkToBlockchain(
        networks.find(
          ({ chainId }) =>
            caipToChainId(bridgeTransaction.targetChain.chainId) === chainId,
        ),
      )
    : bridgeTransaction?.targetChain;

  let chainId: number;

  if (isUnifiedTransfer) {
    chainId = caipToChainId(bridgeTransaction.sourceChain.chainId);
  } else {
    chainId =
      bridgeTransaction?.sourceChain === Blockchain.BITCOIN
        ? isMainnet
          ? ChainId.BITCOIN
          : ChainId.BITCOIN_TESTNET
        : isMainnet
          ? ChainId.AVALANCHE_MAINNET_ID
          : ChainId.AVALANCHE_TESTNET_ID;
  }

  const tokens = useTokensWithBalances({
    forceShowTokensWithoutBalances: true,
    network: getNetwork(chainId),
  });

  if (!bridgeTransaction || !targetBlockchain) {
    return;
  }

  const token = findTokenForAsset(
    getBridgedAssetSymbol(bridgeTransaction),
    targetBlockchain,
    tokens,
  );

  return token?.logoUri;
}
