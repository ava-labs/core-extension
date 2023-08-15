import { Blockchain, BridgeTransaction } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';
import { findTokenForAsset } from '../utils/findTokenForAsset';

export function useLogoUriForBridgeTransaction(
  bridgeTransaction: BridgeTransaction | undefined
): string | undefined {
  const isMainnet = useIsMainnet();

  const chainId =
    bridgeTransaction?.sourceChain === Blockchain.BITCOIN
      ? isMainnet
        ? ChainId.BITCOIN
        : ChainId.BITCOIN_TESTNET
      : isMainnet
      ? ChainId.AVALANCHE_MAINNET_ID
      : ChainId.AVALANCHE_TESTNET_ID;
  const tokens = useTokensWithBalances(true, chainId);

  if (!bridgeTransaction) return;

  const token = findTokenForAsset(
    bridgeTransaction.symbol,
    bridgeTransaction.targetChain,
    tokens
  );

  return token?.logoUri;
}
