import type { Asset } from './utils';
import { isNft, isToken } from './utils';

describe('background/services/blockaid/utils', () => {
  it('should evaluate `isToken` as true', () => {
    const token = { type: 'ERC20' } as Asset;
    const token2 = { type: 'NATIVE' } as Asset;
    expect(isToken(token)).toBe(true);
    expect(isToken(token2)).toBe(true);
  });
  it('should evaluate `isToken` as false', () => {
    const token = {} as Asset;
    const token2 = { type: 'ERC1155' } as Asset;
    const token3 = { type: 'ERC721' } as Asset;
    const token4 = { type: 'NONERC' } as Asset;
    expect(isToken(token)).toBe(false);
    expect(isToken(token2)).toBe(false);
    expect(isToken(token3)).toBe(false);
    expect(isToken(token4)).toBe(false);
  });

  it('should evaluate `isNft` as true', () => {
    const nft = { type: 'ERC1155' } as Asset;
    const nft2 = { type: 'ERC721' } as Asset;
    const nft3 = { type: 'NONERC' } as Asset;
    expect(isNft(nft)).toBe(true);
    expect(isNft(nft2)).toBe(true);
    expect(isNft(nft3)).toBe(true);
  });
  it('should evaluate `isNft` as false', () => {
    const nft = {} as Asset;
    const nft2 = { type: 'ERC20' } as Asset;
    const nft3 = { type: 'NATIVE' } as Asset;
    expect(isNft(nft)).toBe(false);
    expect(isNft(nft2)).toBe(false);
    expect(isNft(nft3)).toBe(false);
  });
});
