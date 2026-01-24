import { Action, MultiTxAction } from '@core/types';
import {
  validateMaxBuyLimit,
  validateSwapUsdPrices,
  validateSwapAmounts,
} from './validation';
import { TokenBalanceChange, SwapValidationContext } from './types';
import { findTokenInBalanceChange } from './helpers';

jest.mock('./helpers', () => ({
  findTokenInBalanceChange: jest.fn(),
}));

describe('validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateMaxBuyLimit', () => {
    it('returns valid when maxBuy is undefined', () => {
      const result = validateMaxBuyLimit(100, undefined);

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns valid when maxBuy is "unlimited"', () => {
      const result = validateMaxBuyLimit(100, 'unlimited');

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns valid when sourceUsdValue is within limit', () => {
      const result = validateMaxBuyLimit(500, '1000');

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns valid when sourceUsdValue equals limit', () => {
      const result = validateMaxBuyLimit(1000, '1000');

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns invalid with manual approval when sourceUsdValue exceeds limit', () => {
      const result = validateMaxBuyLimit(1500, '1000');

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Swap amount ($1500.00) exceeds max buy limit ($1000)',
      });
    });
  });

  describe('validateSwapUsdPrices', () => {
    const createMockTokenBalanceChange = (
      items: { usdPrice: string; displayValue?: string }[],
      decimals = 18,
    ): TokenBalanceChange => ({
      token: { decimals },
      items: items.map((item) => ({
        displayValue: item.displayValue || '1.0',
        usdPrice: item.usdPrice,
      })),
    });

    it('returns invalid when source token has no items', () => {
      const sourceToken = createMockTokenBalanceChange([]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {});

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify token details or pricing',
      });
    });

    it('returns invalid when destination token has no items', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {});

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify token details or pricing',
      });
    });

    it('returns invalid when source USD value is zero', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '0' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {});

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify swap details due to currency price data',
      });
    });

    it('returns invalid when destination USD value is zero', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '0' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {});

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify swap details due to currency price data',
      });
    });

    it('returns valid when user receives more value', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '105' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
      });

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns valid when user receives equal value', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
      });

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns invalid when slippage is not provided', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '99' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {});

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify slippage impact',
      });
    });

    it('returns valid when loss is within slippage tolerance', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '99' }]); // 1% loss

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 2, // 2% tolerance
      });

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('returns invalid when loss exceeds slippage tolerance', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '95' }]); // 5% loss

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1, // 1% tolerance
      });

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Slippage tolerance exceeded',
      });
    });

    it('accounts for Markr fee when swap fees are enabled', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      // 1% slippage + 0.85% fee = 1.85% tolerance
      // destValue needs to be >= 100 * (1 - 0.0185) = 98.15
      const destToken = createMockTokenBalanceChange([{ usdPrice: '98.2' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
        isSwapFeesEnabled: true,
      });

      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });

    it('fails when loss exceeds slippage + fee tolerance', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '100' }]);
      // 1% slippage + 0.85% fee = 1.85% tolerance
      // destValue of 97 is a 3% loss, exceeds tolerance
      const destToken = createMockTokenBalanceChange([{ usdPrice: '97' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
        isSwapFeesEnabled: true,
      });

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Slippage tolerance exceeded',
      });
    });

    it('returns invalid when max buy limit exceeded', () => {
      const sourceToken = createMockTokenBalanceChange([{ usdPrice: '1500' }]);
      const destToken = createMockTokenBalanceChange([{ usdPrice: '1500' }]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
        maxBuy: '1000',
      });

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Swap amount ($1500.00) exceeds max buy limit ($1000)',
      });
    });

    it('sums multiple items for USD values', () => {
      const sourceToken = createMockTokenBalanceChange([
        { usdPrice: '50' },
        { usdPrice: '50' },
      ]);
      const destToken = createMockTokenBalanceChange([
        { usdPrice: '60' },
        { usdPrice: '45' },
      ]);

      const result = validateSwapUsdPrices(sourceToken, destToken, {
        slippage: 1,
      });

      // Source: 100, Dest: 105 (user gains value)
      expect(result).toEqual({
        isValid: true,
        requiresManualApproval: false,
      });
    });
  });

  describe('validateSwapAmounts', () => {
    const createMockAction = (overrides: any = {}): Action => {
      return {
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: {
            ins: [],
            outs: [],
          },
          ...overrides.displayData,
        },
        ...overrides,
      } as Action;
    };

    const createValidContext = (): SwapValidationContext => ({
      minAmountOut: '1000000000000000000', // 1 token in wei
      srcTokenAddress: '0xsource',
      destTokenAddress: '0xdest',
      isSrcTokenNative: false,
      isDestTokenNative: false,
      slippage: 1,
    });

    const createMockTokenBalanceChange = (
      address: string,
      usdPrice: string,
      displayValue: string,
      decimals = 18,
    ): TokenBalanceChange => ({
      token: { address, decimals },
      items: [{ displayValue, usdPrice }],
    });

    it('returns invalid when minAmountOut is missing', () => {
      const action = createMockAction();
      const context = { ...createValidContext(), minAmountOut: undefined };

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when minAmountOut is zero', () => {
      const action = createMockAction();
      const context = { ...createValidContext(), minAmountOut: '0' };

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns hard reject when simulation failed', () => {
      const action = createMockAction({
        displayData: { isSimulationSuccessful: false },
      });
      const context = createValidContext();

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: false,
        reason:
          'Transaction simulation failed - cannot safely auto-approve swap',
      });
    });

    it('returns invalid when balanceChange is missing', () => {
      const action = createMockAction({
        displayData: { isSimulationSuccessful: true, balanceChange: undefined },
      });
      const context = createValidContext();

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when balanceChange.outs is empty', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [] },
        },
      });
      const context = createValidContext();

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when balanceChange.ins is empty', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [], outs: [{}] },
        },
      });
      const context = createValidContext();

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when srcTokenAddress is missing', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = { ...createValidContext(), srcTokenAddress: undefined };

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when destTokenAddress is missing', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = { ...createValidContext(), destTokenAddress: undefined };

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify balance change information',
      });
    });

    it('returns invalid when source token not found in balance change', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = createValidContext();

      jest.mocked(findTokenInBalanceChange).mockReturnValue(undefined);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify token details or pricing',
      });
    });

    it('returns invalid when destination token not found in balance change', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = createValidContext();

      const sourceToken = createMockTokenBalanceChange(
        '0xsource',
        '100',
        '1.0',
      );
      jest
        .mocked(findTokenInBalanceChange)
        .mockReturnValueOnce(sourceToken)
        .mockReturnValueOnce(undefined);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Unable to verify token details or pricing',
      });
    });

    it('returns valid for a successful swap within tolerance', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = createValidContext();

      const sourceToken = createMockTokenBalanceChange(
        '0xsource',
        '100',
        '1.0',
      );
      const destToken = createMockTokenBalanceChange('0xdest', '100', '1.0');

      jest
        .mocked(findTokenInBalanceChange)
        .mockReturnValueOnce(sourceToken)
        .mockReturnValueOnce(destToken);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({ isValid: true });
    });

    it('returns invalid when actual amount is below minimum', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = {
        ...createValidContext(),
        minAmountOut: '2000000000000000000', // 2 tokens
      };

      const sourceToken = createMockTokenBalanceChange(
        '0xsource',
        '100',
        '1.0',
      );
      // Destination token has displayValue of 1.0 = 1e18, but minAmountOut is 2e18
      const destToken = createMockTokenBalanceChange('0xdest', '100', '1.0');

      jest
        .mocked(findTokenInBalanceChange)
        .mockReturnValueOnce(sourceToken)
        .mockReturnValueOnce(destToken);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Swap amount is below the minimum expected quantity',
      });
    });

    it('returns invalid when USD price validation fails', () => {
      const action = createMockAction({
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      });
      const context = {
        ...createValidContext(),
        slippage: 1,
      };

      const sourceToken = createMockTokenBalanceChange(
        '0xsource',
        '100',
        '1.0',
      );
      // 10% loss exceeds 1% slippage
      const destToken = createMockTokenBalanceChange('0xdest', '90', '1.0');

      jest
        .mocked(findTokenInBalanceChange)
        .mockReturnValueOnce(sourceToken)
        .mockReturnValueOnce(destToken);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({
        isValid: false,
        requiresManualApproval: true,
        reason: 'Slippage tolerance exceeded',
      });
    });

    it('works with MultiTxAction', () => {
      const action = {
        displayData: {
          isSimulationSuccessful: true,
          balanceChange: { ins: [{}], outs: [{}] },
        },
      } as MultiTxAction;
      const context = createValidContext();

      const sourceToken = createMockTokenBalanceChange(
        '0xsource',
        '100',
        '1.0',
      );
      const destToken = createMockTokenBalanceChange('0xdest', '100', '1.0');

      jest
        .mocked(findTokenInBalanceChange)
        .mockReturnValueOnce(sourceToken)
        .mockReturnValueOnce(destToken);

      const result = validateSwapAmounts(action, context);

      expect(result).toEqual({ isValid: true });
    });
  });
});
