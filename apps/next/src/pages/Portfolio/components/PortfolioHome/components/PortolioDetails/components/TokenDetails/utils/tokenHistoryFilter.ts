import { FungibleTokenBalance, TxHistoryItem } from '@core/types';
import {
  TokenType,
  TransactionType,
  type TxToken,
} from '@avalabs/vm-module-types';

function hasNativeLegForTokenChain(
  tx: TxHistoryItem,
  token: FungibleTokenBalance,
): boolean {
  if (token.type !== TokenType.NATIVE) {
    return false;
  }
  return tx.tokens.some(
    (leg) =>
      leg.type === TokenType.NATIVE && String(token.coreChainId) === tx.chainId,
  );
}

function walletMatchesAddress(
  walletAddress: string,
  legAddress: string | undefined,
): boolean {
  if (!legAddress || !walletAddress) {
    return false;
  }
  if (legAddress.startsWith('0x') && walletAddress.startsWith('0x')) {
    return legAddress.toLowerCase() === walletAddress.toLowerCase();
  }
  return legAddress === walletAddress;
}

function erc20LegInvolvesWallet(leg: TxToken, walletAddress: string): boolean {
  return (
    walletMatchesAddress(walletAddress, leg.from?.address) ||
    walletMatchesAddress(walletAddress, leg.to?.address)
  );
}

/**
 * Contract calls often list native AVAX (gas/value) or another ERC-20 (e.g. WETH.e) before a
 * USDC leg the wallet still touches (allowance, dust, router bookkeeping). For token detail
 * we treat that USDC leg as noise unless the tx is a typed swap (leg order is meaningful).
 */
function hasEarlierDominantFungibleLegBeforeIndex(
  tx: TxHistoryItem,
  erc20LegIndex: number,
  trackedErc20AddressLower: string,
  tokenCoreChainId: number,
): boolean {
  for (let priorIndex = 0; priorIndex < erc20LegIndex; priorIndex++) {
    const prior = tx.tokens[priorIndex]!;
    if (
      prior.type === TokenType.NATIVE &&
      String(tokenCoreChainId) === tx.chainId
    ) {
      return true;
    }
    if (
      prior.type === TokenType.ERC20 &&
      'address' in prior &&
      prior.address.toLowerCase() !== trackedErc20AddressLower
    ) {
      return true;
    }
  }
  return false;
}

function erc20LegAllowedForContractCall(
  tx: TxHistoryItem,
  legIndex: number,
  trackedErc20AddressLower: string,
  tokenCoreChainId: number,
): boolean {
  if (!tx.isContractCall) {
    return true;
  }
  if (tx.txType === TransactionType.SWAP) {
    return true;
  }
  return !hasEarlierDominantFungibleLegBeforeIndex(
    tx,
    legIndex,
    trackedErc20AddressLower,
    tokenCoreChainId,
  );
}

/**
 * Whether a history row belongs to a fungible asset's detail activity list.
 * Native: only txs that include a `NATIVE` token leg on the same chain as the asset
 * (`chainId` vs `coreChainId`). Omit rows where ETH was only spent as gas (e.g. NFT send
 * with no indexed native transfer leg) so native detail matches “ETH moved as an asset,”
 * not “any outgoing tx.” Indexer vs wallet symbol strings are not compared.
 * ERC-20: match by contract address, wallet on `from`/`to`, and (for non-swap contract calls)
 * no earlier same-chain native or other ERC-20 leg that dominates the row (AVAX / WETH.e +
 * incidental USDC).
 * Pass `walletAddress` from `getAddressForChain` for the asset’s network.
 */
export function transactionMatchesTokenFilter(
  tx: TxHistoryItem,
  token: FungibleTokenBalance,
  walletAddress: string,
): boolean {
  if (token.type === TokenType.NATIVE) {
    return hasNativeLegForTokenChain(tx, token);
  }

  if (token.type !== TokenType.ERC20) {
    return false;
  }

  if (!walletAddress) {
    return false;
  }

  const want = token.address.toLowerCase();
  return tx.tokens.some(
    (leg, legIndex) =>
      leg.type === TokenType.ERC20 &&
      'address' in leg &&
      leg.address.toLowerCase() === want &&
      erc20LegInvolvesWallet(leg, walletAddress) &&
      erc20LegAllowedForContractCall(tx, legIndex, want, token.coreChainId),
  );
}
