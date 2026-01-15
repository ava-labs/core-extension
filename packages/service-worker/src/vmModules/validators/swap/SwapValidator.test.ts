import { RpcMethod } from '@avalabs/vm-module-types';
import { Action, ValidatorType } from '@core/types';
import { ApprovalParamsWithContext, ValidationResult } from '../../models';
import { SwapValidator, swapValidator } from './SwapValidator';
import { validateSwapAmounts } from './validation';

jest.mock('webextension-polyfill', () => ({
  runtime: {
    getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
  },
}));

jest.mock('./validation', () => ({
  validateSwapAmounts: jest.fn(),
}));

describe('SwapValidator', () => {
  let validator: SwapValidator;

  beforeEach(() => {
    jest.clearAllMocks();
    validator = new SwapValidator();
  });

  const createMockParams = (overrides: any = {}): ApprovalParamsWithContext => {
    const base = {
      request: {
        requestId: 'test-request-id',
        sessionId: 'test-session-id',
        method: RpcMethod.ETH_SEND_TRANSACTION,
        chainId: 'eip155:43114',
        context: {
          autoApprove: true,
        },
        dappInfo: undefined,
      },
      signingData: {
        type: RpcMethod.ETH_SEND_TRANSACTION,
        data: {
          to: '0x1234567890123456789012345678901234567890',
        },
      },
    };

    const result = {
      ...base,
      ...overrides,
      request: {
        ...base.request,
        ...overrides.request,
      },
      signingData: {
        ...base.signingData,
        ...overrides.signingData,
        data: {
          ...base.signingData.data,
          ...overrides.signingData?.data,
        },
      },
    };

    return result as ApprovalParamsWithContext;
  };

  describe('type', () => {
    it('should have SWAP validator type', () => {
      expect(validator.type).toBe(ValidatorType.SWAP);
    });
  });

  describe('canHandle', () => {
    it('returns false when context.autoApprove is falsy', () => {
      const params = createMockParams({
        request: { context: { autoApprove: false } },
      });

      expect(validator.canHandle(params)).toBe(false);
    });

    it('returns false when context is undefined', () => {
      const params = createMockParams({
        request: { context: undefined },
      });

      expect(validator.canHandle(params)).toBe(false);
    });

    it('returns false when signingData.type is not ETH_SEND_TRANSACTION', () => {
      const params = createMockParams({
        signingData: {
          type: RpcMethod.BITCOIN_SEND_TRANSACTION,
          data: {},
        },
      });

      expect(validator.canHandle(params)).toBe(false);
    });

    it('returns false when request is from external dApp', () => {
      const params = createMockParams({
        request: {
          dappInfo: {
            url: 'https://malicious-dapp.com',
            name: 'Malicious Dapp',
            icon: '',
          },
        },
      });

      expect(validator.canHandle(params)).toBe(false);
    });

    it('returns false when swap destination is zero address', () => {
      const params = createMockParams({
        signingData: {
          type: RpcMethod.ETH_SEND_TRANSACTION,
          data: {
            to: '0x0000000000000000000000000000000000000000',
          },
        },
      });

      expect(validator.canHandle(params)).toBe(false);
    });

    it('returns true when dappInfo.url matches extension URL', () => {
      const params = createMockParams({
        request: {
          dappInfo: {
            url: 'chrome-extension://test-id/',
            name: 'Core',
            icon: '',
          },
        },
      });

      expect(validator.canHandle(params)).toBe(true);
    });

    it('returns true when dappInfo.url starts with extension URL', () => {
      const params = createMockParams({
        request: {
          dappInfo: {
            url: 'chrome-extension://test-id/popup.html',
            name: 'Core',
            icon: '',
          },
        },
      });

      expect(validator.canHandle(params)).toBe(true);
    });

    it('returns true when all conditions are met', () => {
      const params = createMockParams();

      expect(validator.canHandle(params)).toBe(true);
    });
  });

  describe('validateAction', () => {
    it('delegates to validateSwapAmounts with action and context', () => {
      const mockAction = { id: 'test-action' } as unknown as Action;
      const params = createMockParams();
      const mockResult: ValidationResult = { isValid: true };

      jest.mocked(validateSwapAmounts).mockReturnValue(mockResult);

      const result = validator.validateAction(mockAction, params);

      expect(validateSwapAmounts).toHaveBeenCalledWith(
        mockAction,
        params.request.context,
      );
      expect(result).toBe(mockResult);
    });

    it('returns validation failure from validateSwapAmounts', () => {
      const mockAction = { id: 'test-action' } as unknown as Action;
      const params = createMockParams();
      const mockResult: ValidationResult = {
        isValid: false,
        requiresManualApproval: true,
        reason: 'Slippage tolerance exceeded',
      };

      jest.mocked(validateSwapAmounts).mockReturnValue(mockResult);

      const result = validator.validateAction(mockAction, params);

      expect(result).toBe(mockResult);
    });
  });

  describe('singleton instance', () => {
    it('exports a singleton swapValidator instance', () => {
      expect(swapValidator).toBeInstanceOf(SwapValidator);
      expect(swapValidator.type).toBe(ValidatorType.SWAP);
    });
  });
});
