import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { AccountType } from '../../accounts/models';
import { GetBtcWalletPolicyDetails } from './getBtcWalletPolicyDetails';

describe('src/background/services/wallet/handlers/getBtcWalletPolicyDetails.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.WALLET_GET_BTC_WALLET_POLICY_DETAILS,
  } as any;

  const walletServiceMock = {
    getBtcWalletPolicyDetails: jest.fn(),
  } as any;

  const getAccountServiceMock = (activeAccount?: { type: AccountType }) =>
    ({
      activeAccount,
    } as any);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns undefined if there is no active account', async () => {
    const handler = new GetBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock()
    );

    const result = await handler.handle(request);

    expect(result).toStrictEqual({
      ...request,
      result: undefined,
    });
  });

  it('returns undefined if the active account is not primary', async () => {
    const handler = new GetBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock({ type: AccountType.IMPORTED })
    );

    const result = await handler.handle(request);

    expect(result).toStrictEqual({
      ...request,
      result: undefined,
    });
  });

  it('returns the master fingerprint correctly', async () => {
    const masterFingerprint = 'fingerprint';

    walletServiceMock.getBtcWalletPolicyDetails.mockResolvedValueOnce({
      masterFingerprint,
    });

    const handler = new GetBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock({ type: AccountType.PRIMARY })
    );

    const result = await handler.handle(request);

    expect(result).toStrictEqual({
      ...request,
      result: {
        masterFingerprint,
      },
    });
  });
});
