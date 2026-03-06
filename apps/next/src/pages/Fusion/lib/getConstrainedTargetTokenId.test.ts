import { TokenType } from '@avalabs/vm-module-types';
import { BitcoinCaip2ChainId, ChainId } from '@avalabs/core-chains-sdk';

import { FungibleTokenBalance } from '@core/types';

import { BTCB_ADDRESS_MAINNET, BTCB_ADDRESS_TESTNET } from '../fusion-config';

import { getConstrainedTargetTokenId } from './getConstrainedTargetTokenId';

const createBtcToken = (isTestnet: boolean): FungibleTokenBalance =>
  ({
    type: TokenType.NATIVE,
    assetType: 'btc_native',
    symbol: 'BTC',
    chainCaipId: isTestnet
      ? BitcoinCaip2ChainId.TESTNET
      : BitcoinCaip2ChainId.MAINNET,
    coreChainId: isTestnet ? ChainId.BITCOIN_TESTNET : ChainId.BITCOIN,
  }) as FungibleTokenBalance;

const createEvmNativeToken = (): FungibleTokenBalance =>
  ({
    type: TokenType.NATIVE,
    assetType: 'evm_native',
    symbol: 'AVAX',
    chainCaipId: 'eip155:43114',
    coreChainId: ChainId.AVALANCHE_MAINNET_ID,
  }) as FungibleTokenBalance;

const createErc20Token = (): FungibleTokenBalance =>
  ({
    type: TokenType.ERC20,
    assetType: 'evm_erc20',
    symbol: 'USDC',
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    chainCaipId: 'eip155:43114',
    coreChainId: ChainId.AVALANCHE_MAINNET_ID,
  }) as FungibleTokenBalance;

describe('getConstrainedTargetTokenId', () => {
  it('returns BTC.b mainnet token ID for BTC mainnet', () => {
    const btcMainnet = createBtcToken(false);
    const result = getConstrainedTargetTokenId(btcMainnet);

    expect(result).toBe(
      `${TokenType.ERC20}:${BTCB_ADDRESS_MAINNET}:${ChainId.AVALANCHE_MAINNET_ID}`,
    );
  });

  it('returns BTC.b testnet token ID for BTC testnet', () => {
    const btcTestnet = createBtcToken(true);
    const result = getConstrainedTargetTokenId(btcTestnet);

    expect(result).toBe(
      `${TokenType.ERC20}:${BTCB_ADDRESS_TESTNET}:${ChainId.AVALANCHE_TESTNET_ID}`,
    );
  });

  it('returns null for EVM native tokens', () => {
    const avaxToken = createEvmNativeToken();
    const result = getConstrainedTargetTokenId(avaxToken);

    expect(result).toBeNull();
  });

  it('returns null for ERC20 tokens', () => {
    const usdcToken = createErc20Token();
    const result = getConstrainedTargetTokenId(usdcToken);

    expect(result).toBeNull();
  });
});
