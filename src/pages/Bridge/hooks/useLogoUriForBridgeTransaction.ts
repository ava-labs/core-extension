import { Blockchain, BridgeTransaction } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import { useIsMainnet } from '@src/hooks/useIsMainnet';
import { useTokensWithBalances } from '@src/hooks/useTokensWithBalances';

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

  // When the source is Avalanche use the wrapped version of the symbol e.g. BTC.b
  const symbol = bridgeTransaction.symbol;
  const wrappedSymbol = getWrappedSymbol(
    bridgeTransaction.symbol,
    bridgeTransaction.targetChain
  );

  const token = tokens.find(
    (t) => t.symbol === symbol || t.symbol === wrappedSymbol
  );
  return token?.logoUri;
}

function getWrappedSymbol(symbol: string, chain: Blockchain): string {
  if (chain === Blockchain.ETHEREUM) {
    return `${symbol}.e`;
  } else if (chain === Blockchain.BITCOIN) {
    return `${symbol}.b`;
  }
  return symbol;
}
