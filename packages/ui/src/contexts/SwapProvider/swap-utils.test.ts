import { SolanaProvider } from '@avalabs/core-wallets-sdk';
import { findAssociatedTokenPda } from '@solana-program/token';

import { getJupiterFeeAccount, getFeeAccountInfo } from './swap-utils';
import { JupiterQuote } from './models';
import { SOL_MINT } from './constants';

jest.mock('@solana-program/token');
jest.mock('@solana/kit', () => ({
  address: jest.fn().mockImplementation((address) => address),
}));

describe('src/contexts/SwapProvider/swap-utils', () => {
  describe('getJupiterFeeAccount', () => {
    it('returns fee account address when initialized', async () => {
      const mockProvider = {
        getAccountInfo: jest.fn().mockReturnValue({
          send: jest.fn().mockResolvedValue({ value: {} }),
        }),
      };
      (findAssociatedTokenPda as jest.Mock).mockResolvedValue(['feeAccount']);

      const result = await getJupiterFeeAccount(
        true,
        {
          swapMode: 'ExactIn',
          inputMint: '0x123',
          outputMint: SOL_MINT,
        } as JupiterQuote,
        mockProvider as unknown as SolanaProvider,
        jest.fn(),
      );

      expect(result).toBe('feeAccount');
    });

    it('returns undefined when feature flag is disabled', async () => {
      const result = await getJupiterFeeAccount(
        false,
        {} as JupiterQuote,
        {} as SolanaProvider,
        jest.fn(),
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getFeeAccountInfo', () => {
    it('returns fee account address when initialized', async () => {
      const mockProvider = {
        getAccountInfo: jest.fn().mockReturnValue({
          send: jest.fn().mockResolvedValue({ value: {} }),
        }),
      };
      (findAssociatedTokenPda as jest.Mock).mockResolvedValue(['feeAccount']);

      const result = await getFeeAccountInfo(
        mockProvider as unknown as SolanaProvider,
        '0x123',
      );

      expect(result).toEqual({
        feeAccount: 'feeAccount',
        isInitialized: true,
      });
    });

    it('returns info on account not being initialized', async () => {
      const mockProvider = {
        getAccountInfo: jest.fn().mockReturnValue({
          send: jest.fn().mockResolvedValue({ value: null }),
        }),
      };
      (findAssociatedTokenPda as jest.Mock).mockResolvedValue(['feeAccount']);

      const result = await getFeeAccountInfo(
        mockProvider as unknown as SolanaProvider,
        '0x123',
      );

      expect(result).toEqual({
        feeAccount: 'feeAccount',
        isInitialized: false,
      });
    });
  });
});
