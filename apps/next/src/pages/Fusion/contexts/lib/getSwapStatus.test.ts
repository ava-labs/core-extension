import { Quote, TransferManager } from '@avalabs/unified-asset-transfer';

import { Account, FungibleTokenBalance } from '@core/types';

import { getSwapStatus } from './getSwapStatus';

const mockAccount = { id: 'test-account' } as Account;
const mockManager = {} as TransferManager;
const mockQuote = {} as Quote;
const mockSourceTokenList = [{ symbol: 'AVAX' }] as FungibleTokenBalance[];
const mockTargetTokenList = [{ symbol: 'USDC' }] as FungibleTokenBalance[];

describe('getSwapStatus', () => {
  describe('loading states', () => {
    it('returns loading when account is not available', () => {
      const result = getSwapStatus(
        undefined,
        false,
        mockManager,
        false,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('loading');
    });

    it('returns loading when balances are loading', () => {
      const result = getSwapStatus(
        mockAccount,
        true,
        mockManager,
        false,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('loading');
    });

    it('returns loading when manager is not available and no initialization error', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        undefined,
        false,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('loading');
    });
  });

  describe('error states', () => {
    it('returns initialization-failed when there is an initialization error', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        undefined,
        true,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('initialization-failed');
    });

    it('returns no-swappable-assets when source token list is empty', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        [],
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('no-swappable-assets');
    });

    it('returns no-routes-found when target token list is empty', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        mockSourceTokenList,
        [],
        null,
      );

      expect(result).toBe('no-routes-found');
    });
  });

  describe('ready states', () => {
    it('returns ready-to-transfer when a quote is selected', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        mockSourceTokenList,
        mockTargetTokenList,
        mockQuote,
      );

      expect(result).toBe('ready-to-transfer');
    });

    it('returns initialized when all conditions are met but no quote selected', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('initialized');
    });
  });

  describe('priority order', () => {
    it('prioritizes loading over initialization-failed', () => {
      const result = getSwapStatus(
        undefined,
        false,
        undefined,
        true,
        mockSourceTokenList,
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('loading');
    });

    it('prioritizes initialization-failed over no-swappable-assets', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        undefined,
        true,
        [],
        mockTargetTokenList,
        null,
      );

      expect(result).toBe('initialization-failed');
    });

    it('prioritizes no-swappable-assets over no-routes-found', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        [],
        [],
        null,
      );

      expect(result).toBe('no-swappable-assets');
    });

    it('prioritizes no-routes-found over ready-to-transfer', () => {
      const result = getSwapStatus(
        mockAccount,
        false,
        mockManager,
        false,
        mockSourceTokenList,
        [],
        mockQuote,
      );

      expect(result).toBe('no-routes-found');
    });
  });
});
