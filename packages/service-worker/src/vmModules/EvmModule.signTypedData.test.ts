import { EvmModule } from '@avalabs/evm-module';
import {
  AppName,
  ApprovalController,
  Environment,
  Network,
  NetworkVMType,
  RpcMethod,
  RpcRequest,
} from '@avalabs/vm-module-types';

// evm-module treats a failed Blockaid scan as a warning and still prompts for approval.
const mockBlockaidScan = jest.fn().mockRejectedValue(new Error('offline'));
jest.mock('@blockaid/client', () =>
  jest.fn(() => ({ evm: { jsonRpc: { scan: mockBlockaidScan } } })),
);

const ACCOUNT = '0x05BcD07A055a950183D0B0cd88caa579fE58D2Ea';

const cChain: Network = {
  chainId: 43114,
  caipId: 'eip155:43114',
  chainName: 'Avalanche C-Chain',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  logoUri: 'https://example.com/avax.png',
  networkToken: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    logoUri: 'https://example.com/avax.png',
  },
  vmName: NetworkVMType.EVM,
};

const tosAcceptance = {
  domain: { name: 'BENQI Terms of Service', version: '1' },
  message: {
    statement:
      'By signing this message, you confirm that you have read and agree to the BENQI Terms of Service and Privacy Policy.',
    version: '4 April 2026',
    termsOfServiceMd5: '1100f9f16d8b1861b9cada7951045a93',
    privacyPolicyMd5: 'cf59903260eb59c7c567605a326702bd',
    wallet: ACCOUNT.toLowerCase(),
    signedAt: '2026-10-16T09:36:00.322Z',
  },
  primaryType: 'ToSAcceptance',
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
    ],
    ToSAcceptance: [
      { name: 'statement', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'termsOfServiceMd5', type: 'string' },
      { name: 'privacyPolicyMd5', type: 'string' },
      { name: 'wallet', type: 'address' },
      { name: 'signedAt', type: 'string' },
    ],
  },
};

const withDomainChainId = (chainId: number | string) => ({
  ...tosAcceptance,
  domain: { ...tosAcceptance.domain, chainId },
  types: {
    ...tosAcceptance.types,
    EIP712Domain: [
      ...tosAcceptance.types.EIP712Domain,
      { name: 'chainId', type: 'uint256' },
    ],
  },
});

const buildRequest = (method: RpcMethod, typedData: object): RpcRequest => ({
  requestId: 'request-id',
  sessionId: 'session-id',
  method,
  chainId: 'eip155:43114',
  params: [ACCOUNT, JSON.stringify(typedData)],
  dappInfo: {
    name: 'BENQI',
    url: 'https://app.benqi.fi',
    icon: 'https://app.benqi.fi/favicon.ico',
  },
});

describe('EvmModule typed data signing', () => {
  let approvalController: jest.Mocked<ApprovalController>;
  let evmModule: EvmModule;

  beforeEach(() => {
    approvalController = {
      requestApproval: jest.fn().mockResolvedValue({ signedData: '0xsigned' }),
      requestPublicKey: jest.fn(),
      onTransactionPending: jest.fn(),
      onTransactionConfirmed: jest.fn(),
      onTransactionReverted: jest.fn(),
    };

    evmModule = new EvmModule({
      environment: Environment.PRODUCTION,
      approvalController,
      appInfo: { name: AppName.CORE_EXTENSION, version: '0.0.0' },
      runtime: {
        fetch: jest.fn(),
        getAuthHeaders: async () => ({}),
      },
    });
  });

  describe.each([RpcMethod.SIGN_TYPED_DATA_V3, RpcMethod.SIGN_TYPED_DATA_V4])(
    '%s',
    (method) => {
      it('prompts for approval when the domain has no chainId, since every EIP-712 domain field is optional', async () => {
        const result = await evmModule.onRpcRequest(
          buildRequest(method, tosAcceptance),
          cChain,
        );

        expect(approvalController.requestApproval).toHaveBeenCalledTimes(1);
        expect(approvalController.requestApproval).toHaveBeenCalledWith(
          expect.objectContaining({
            signingData: {
              type: method,
              account: ACCOUNT,
              data: tosAcceptance,
            },
          }),
        );
        expect(result).toEqual({ result: '0xsigned' });
      });

      it.each([43114, '0xa86a'])(
        'prompts for approval when the domain chainId (%p) matches the requested network',
        async (chainId) => {
          const result = await evmModule.onRpcRequest(
            buildRequest(method, withDomainChainId(chainId)),
            cChain,
          );

          expect(approvalController.requestApproval).toHaveBeenCalledTimes(1);
          expect(result).toEqual({ result: '0xsigned' });
        },
      );

      it.each([1, '0x1'])(
        'rejects before approval when the domain chainId (%p) does not match the requested network',
        async (chainId) => {
          const result = await evmModule.onRpcRequest(
            buildRequest(method, withDomainChainId(chainId)),
            cChain,
          );

          expect(approvalController.requestApproval).not.toHaveBeenCalled();
          expect(result).toEqual({
            success: false,
            error: expect.objectContaining({
              message: expect.stringContaining(
                'does not match the requested network (43114)',
              ),
            }),
          });
        },
      );
    },
  );
});
