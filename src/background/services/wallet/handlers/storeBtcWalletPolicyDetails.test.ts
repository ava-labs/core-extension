import { DerivationPath, getBech32AddressFromXPub } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { networks } from 'bitcoinjs-lib';
import { AccountType } from '../../accounts/models';
import { StoreBtcWalletPolicyDetails } from './storeBtcWalletPolicyDetails';

jest.mock('@avalabs/wallets-sdk');

describe('src/background/services/wallet/handlers/storeBtcWalletPolicyDetails.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS,
    params: ['xpub', 'masterFingerprint', 'hmacHex', 'name'],
  } as any;

  const walletServiceMock = {
    storeBtcWalletPolicyDetails: jest.fn(),
    derivationPath: DerivationPath.BIP44,
  } as any;

  const networkServiceMock = {
    isMainnet: () => false,
  } as any;

  const getAccountServiceMock = (activeAccount?: {
    type: AccountType;
    index: number;
    addressBTC: string;
  }) =>
    ({
      activeAccount,
    } as any);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws if there is no active account', async () => {
    const handler = new StoreBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock(),
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrowError(
      'no account selected'
    );
  });

  it('throws if the active account is not primary', async () => {
    const handler = new StoreBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock({
        type: AccountType.IMPORTED,
        index: 0,
        addressBTC: '0x1',
      }),
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrowError(
      'incorrect account type'
    );
  });

  it('throws if wallet derivation path is unknown', async () => {
    const handler = new StoreBtcWalletPolicyDetails(
      { ...walletServiceMock, derivationPath: undefined },
      getAccountServiceMock({
        type: AccountType.PRIMARY,
        index: 0,
        addressBTC: '0x1',
      }),
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrowError(
      'unknown derivation path'
    );
  });

  it('does nothing if the device is incorrect', async () => {
    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x2');

    const handler = new StoreBtcWalletPolicyDetails(
      walletServiceMock,
      getAccountServiceMock({
        type: AccountType.PRIMARY,
        index: 0,
        addressBTC: '0x1',
      }),
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(
      walletServiceMock.storeBtcWalletPolicyDetails
    ).not.toHaveBeenCalled();

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: false,
      },
    });
  });

  it('stores the details if the device is correct for BIP44', async () => {
    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');

    const handler = new StoreBtcWalletPolicyDetails(
      { ...walletServiceMock, derivationPath: DerivationPath.BIP44 },
      getAccountServiceMock({
        type: AccountType.PRIMARY,
        index: 1,
        addressBTC: '0x1',
      }),
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
      'xpub',
      1,
      networks.testnet
    );

    expect(walletServiceMock.storeBtcWalletPolicyDetails).toHaveBeenCalledWith(
      1,
      ...['xpub', 'masterFingerprint', 'hmacHex', 'name']
    );

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: true,
      },
    });
  });

  it('stores the details if the device is correct for Ledger Live', async () => {
    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');

    const handler = new StoreBtcWalletPolicyDetails(
      { ...walletServiceMock, derivationPath: DerivationPath.LedgerLive },
      getAccountServiceMock({
        type: AccountType.PRIMARY,
        index: 1,
        addressBTC: '0x1',
      }),
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
      'xpub',
      0,
      networks.testnet
    );

    expect(walletServiceMock.storeBtcWalletPolicyDetails).toHaveBeenCalledWith(
      1,
      ...['xpub', 'masterFingerprint', 'hmacHex', 'name']
    );

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: true,
      },
    });
  });
});
