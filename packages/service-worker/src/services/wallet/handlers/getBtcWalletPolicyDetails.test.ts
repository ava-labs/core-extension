import { ExtensionRequest, AccountType } from '@core/types';
import { GetBtcWalletPolicyDetails } from './getBtcWalletPolicyDetails';
import { buildRpcCall } from '@shared/tests/test-utils';

describe('src/background/services/wallet/handlers/getBtcWalletPolicyDetails.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
  } as any;

  const secretsServiceMock = {
    getBtcWalletPolicyDetails: jest.fn(),
  } as any;

  const getAccountServiceMock = (activeAccount?: { type: AccountType }) =>
    ({
      getActiveAccount: async () => activeAccount,
    }) as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns undefined if there is no active account', async () => {
    const handler = new GetBtcWalletPolicyDetails(
      secretsServiceMock,
      getAccountServiceMock(),
    );

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toStrictEqual({
      ...request,
      result: undefined,
    });
  });

  it('returns undefined if the active account is not primary', async () => {
    const handler = new GetBtcWalletPolicyDetails(
      secretsServiceMock,
      getAccountServiceMock({ type: AccountType.IMPORTED }),
    );

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toStrictEqual({
      ...request,
      result: undefined,
    });
  });

  it('returns the master fingerprint correctly', async () => {
    const masterFingerprint = 'fingerprint';

    secretsServiceMock.getBtcWalletPolicyDetails.mockResolvedValueOnce({
      accountIndex: 0,
      details: {
        masterFingerprint,
      },
    });

    const handler = new GetBtcWalletPolicyDetails(
      secretsServiceMock,
      getAccountServiceMock({ type: AccountType.PRIMARY }),
    );

    const result = await handler.handle(buildRpcCall(request));

    expect(result).toStrictEqual({
      ...request,
      result: {
        masterFingerprint,
      },
    });
  });
});
