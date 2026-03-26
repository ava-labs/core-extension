import { TokenType, type TxToken } from '@avalabs/vm-module-types';
import { resolveSwapDisplayTokens } from './resolveSwapDisplayTokens';

const wallet = '0xUser00000000000000000000000000000000000001';
const walletChecksummed = '0xUSER00000000000000000000000000000000000001';
const router = '0xRouter0000000000000000000000000000000000002';

function fungibleLeg(symbol: string, from: string, to: string): TxToken {
  return {
    type: TokenType.ERC20,
    address: '0x0000000000000000000000000000000000000003',
    name: symbol,
    symbol,
    amount: '1',
    from: { address: from },
    to: { address: to },
  };
}

describe('resolveSwapDisplayTokens', () => {
  it('picks outgoing then incoming by wallet address when token order is send then receive', () => {
    const usdc = fungibleLeg('USDC', wallet, router);
    const weth = fungibleLeg('WETH', router, wallet);
    const result = resolveSwapDisplayTokens([usdc, weth], wallet);
    expect(result).toEqual({
      source: usdc,
      target: weth,
    });
  });

  it('picks outgoing then incoming when API lists receive leg first', () => {
    const weth = fungibleLeg('WETH', router, wallet);
    const usdc = fungibleLeg('USDC', wallet, router);
    const result = resolveSwapDisplayTokens([weth, usdc], wallet);
    expect(result).toEqual({
      source: usdc,
      target: weth,
    });
  });

  it('matches EVM addresses case-insensitively', () => {
    const usdc = fungibleLeg('USDC', wallet, router);
    const weth = fungibleLeg('WETH', router, wallet);
    const result = resolveSwapDisplayTokens([usdc, weth], walletChecksummed);
    expect(result).toEqual({
      source: usdc,
      target: weth,
    });
  });

  it('falls back to tokens[0] and tokens[1] when legs are not tied to the wallet in from/to', () => {
    const a = fungibleLeg('AAA', router, router);
    const b = fungibleLeg('BBB', router, router);
    const result = resolveSwapDisplayTokens([a, b], wallet);
    expect(result).toEqual({ source: a, target: b });
  });

  it('returns undefined target when only the source leg matches the wallet', () => {
    const usdc = fungibleLeg('USDC', wallet, router);
    const ghost = fungibleLeg('GHOST', router, router);
    const result = resolveSwapDisplayTokens([usdc, ghost], wallet);
    expect(result).toEqual({ source: usdc, target: undefined });
  });

  it('returns undefined source when only the target leg matches the wallet', () => {
    const ghost = fungibleLeg('GHOST', router, router);
    const weth = fungibleLeg('WETH', router, wallet);
    const result = resolveSwapDisplayTokens([ghost, weth], wallet);
    expect(result).toEqual({ source: undefined, target: weth });
  });

  it('returns both undefined when there are no tokens', () => {
    expect(resolveSwapDisplayTokens([], wallet)).toEqual({
      source: undefined,
      target: undefined,
    });
  });

  it('returns a single token when userAddress is empty', () => {
    const one = fungibleLeg('ONE', router, wallet);
    expect(resolveSwapDisplayTokens([one], '')).toEqual({
      source: one,
      target: undefined,
    });
  });
});
