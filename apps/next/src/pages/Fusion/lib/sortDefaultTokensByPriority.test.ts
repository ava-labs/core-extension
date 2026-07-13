import { ChainId } from '@avalabs/core-chains-sdk';
import { TokenType } from '@avalabs/vm-module-types';

import type { FungibleAssetType, FungibleTokenBalance } from '@core/types';

import { sortDefaultTokensByPriority } from './sortDefaultTokensByPriority';

const createNativeToken = (
  symbol: string,
  coreChainId: ChainId,
  assetType: FungibleAssetType = 'evm_native',
): FungibleTokenBalance =>
  ({
    type: TokenType.NATIVE,
    assetType,
    symbol,
    coreChainId,
  }) as FungibleTokenBalance;

describe('sortDefaultTokensByPriority', () => {
  it('prefers C-Chain AVAX over other native AVAX tokens', () => {
    const pChainAvax = createNativeToken(
      'AVAX',
      ChainId.AVALANCHE_P,
      'pvm_native',
    );
    const cChainAvax = createNativeToken('AVAX', ChainId.AVALANCHE_MAINNET_ID);

    expect(
      [pChainAvax, cChainAvax].toSorted(sortDefaultTokensByPriority),
    ).toEqual([cChainAvax, pChainAvax]);
  });

  it('keeps AVAX ahead of ETH and SOL', () => {
    const eth = createNativeToken('ETH', ChainId.ETHEREUM_HOMESTEAD);
    const sol = createNativeToken('SOL', ChainId.SOLANA_MAINNET_ID);
    const avax = createNativeToken('AVAX', ChainId.AVALANCHE_MAINNET_ID);

    expect([sol, eth, avax].toSorted(sortDefaultTokensByPriority)).toEqual([
      avax,
      eth,
      sol,
    ]);
  });
});
