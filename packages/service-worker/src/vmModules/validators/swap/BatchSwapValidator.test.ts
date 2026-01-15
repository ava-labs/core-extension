import { RpcMethod } from '@avalabs/vm-module-types';
import { MultiTxAction, ValidatorType } from '@core/types';
import { MultiApprovalParamsWithContext, ValidationResult } from '../../models';
import { BatchSwapValidator, batchSwapValidator } from './BatchSwapValidator';
import { validateSwapAmounts } from './validation';

jest.mock('webextension-polyfill', () => ({
  runtime: {
    getURL: jest.fn((path: string) => `chrome-extension://test-id/${path}`),
  },
}));

jest.mock('./validation', () => ({
  validateSwapAmounts: jest.fn(),
}));

describe('BatchSwapValidator', () => {
  let validator: BatchSwapValidator;

  beforeEach(() => {
    jest.clearAllMocks();
    validator = new BatchSwapValidator();
  });

  const createMockParams = (
    overrides: any = {},
  ): MultiApprovalParamsWithContext => {
    const base = {
      request: {
        requestId: 'test-request-id',
        sessionId: 'test-session-id',
        method: RpcMethod.ETH_SEND_TRANSACTION_BATCH,
        chainId: 'eip155:43114',
        context: {
          autoApprove: true,
        },
        dappInfo: undefined,
      },
      signingRequests: [
        {
          signingData: {
            type: RpcMethod.ETH_SEND_TRANSACTION,
            data: {},
          },
        },
        {
          signingData: {
            type: RpcMethod.ETH_SEND_TRANSACTION,
            data: {},
          },
        },
      ],
    };

    const result = {
      ...base,
      ...overrides,
      request: {
        ...base.request,
        ...overrides.request,
      },
      signingRequests: overrides.signingRequests ?? base.signingRequests,
    };

    return result as MultiApprovalParamsWithContext;
  };

  describe('type', () => {
    it('should have BATCH_SWAP validator type', () => {
      expect(validator.type).toBe(ValidatorType.BATCH_SWAP);
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

    it('returns false when not all transactions are ETH_SEND_TRANSACTION', () => {
      const params = createMockParams({
        signingRequests: [
          {
            signingData: {
              type: RpcMethod.ETH_SEND_TRANSACTION,
              data: {},
            },
          },
          {
            signingData: {
              type: RpcMethod.BITCOIN_SEND_TRANSACTION,
              data: {},
            },
          },
        ],
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

    it('returns true when all transactions are EVM and conditions are met', () => {
      const params = createMockParams();

      expect(validator.canHandle(params)).toBe(true);
    });

    it('returns true with single EVM transaction in batch', () => {
      const params = createMockParams({
        signingRequests: [
          {
            signingData: {
              type: RpcMethod.ETH_SEND_TRANSACTION,
              data: {},
            },
          },
        ],
      });

      expect(validator.canHandle(params)).toBe(true);
    });
  });

  describe('validateAction', () => {
    it('delegates to validateSwapAmounts with action and context', () => {
      const mockAction = { id: 'test-action' } as unknown as MultiTxAction;
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
      const mockAction = { id: 'test-action' } as unknown as MultiTxAction;
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
    it('exports a singleton batchSwapValidator instance', () => {
      expect(batchSwapValidator).toBeInstanceOf(BatchSwapValidator);
      expect(batchSwapValidator.type).toBe(ValidatorType.BATCH_SWAP);
    });
  });
});
