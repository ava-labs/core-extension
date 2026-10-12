import { NetworkVMType } from '@avalabs/core-chains-sdk';

import { normalizeTokenAddress } from './normalizeTokenAddress';

describe('normalizeTokenAddress', () => {
  it('lowercases EVM addresses', () => {
    expect(
      normalizeTokenAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', {
        vmName: NetworkVMType.EVM,
      }),
    ).toBe('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
  });

  it('keeps the case of Solana addresses', () => {
    expect(
      normalizeTokenAddress('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', {
        vmName: NetworkVMType.SVM,
      }),
    ).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  });
});
