import { Blockchain, BridgeTransaction } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { BridgeTransfer } from '@avalabs/bridge-unified';

import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

import { findTokenForAsset } from '../utils/findTokenForAsset';
import { networkToBlockchain } from '../utils/blockchainConversion';
import { caipToChainId } from '@src/utils/caipConversion';

export function useLogoUriForBridgeTransaction(
  bridgeTransaction: BridgeTransaction | BridgeTransfer | undefined
): string | undefined {
  const { network, networks } = useNetworkContext();

  const isMainnet = !network?.isTestnet;
  const isUnifiedTransfer = typeof bridgeTransaction?.sourceChain === 'object';
  const targetBlockchain = isUnifiedTransfer
    ? networkToBlockchain(
        networks.find(
          ({ chainId }) =>
            caipToChainId(bridgeTransaction.targetChain.chainId) === chainId
        )
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
    chainId,
  });

  if (!bridgeTransaction || !targetBlockchain) {
    return;
  }

  const token = findTokenForAsset(
    bridgeTransaction.symbol,
    targetBlockchain,
    tokens
  );

  return token?.logoUri;
}
