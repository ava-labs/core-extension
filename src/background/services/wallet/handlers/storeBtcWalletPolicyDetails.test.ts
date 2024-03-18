import { DerivationPath, getBech32AddressFromXPub } from '@avalabs/wallets-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { networks } from 'bitcoinjs-lib';
import { AccountType } from '../../accounts/models';
import { AccountWithSecrets, SecretType } from '../../secrets/models';
import { SecretsService } from '../../secrets/SecretsService';
import { StoreBtcWalletPolicyDetails } from './storeBtcWalletPolicyDetails';

jest.mock('@avalabs/wallets-sdk');

describe('src/background/services/wallet/handlers/storeBtcWalletPolicyDetails.ts', () => {
  const request = {
    id: '123',
    method: ExtensionRequest.WALLET_STORE_BTC_WALLET_POLICY_DETAILS,
    params: ['xpub', 'masterFingerprint', 'hmacHex', 'name'],
  } as any;

  const secretsServiceMock = jest.mocked({
    storeBtcWalletPolicyDetails: jest.fn(),
    getActiveAccountSecrets: jest.fn(),
  } as unknown as SecretsService);

  const networkServiceMock = {
    isMainnet: () => false,
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('throws if there is no active account', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
    } as AccountWithSecrets);

    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrow(
      'no account selected'
    );
  });

  it('throws if the active account is not primary', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      account: {
        type: AccountType.IMPORTED,
      } as any,
    } as AccountWithSecrets);
    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrow(
      'incorrect account type'
    );
  });

  it('throws if wallet derivation path is unknown', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      account: {
        type: AccountType.PRIMARY,
        index: 0,
        addressBTC: '0x1',
      },
    } as AccountWithSecrets);

    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    await expect(handler.handle(request)).rejects.toThrow(
      'unknown derivation path'
    );
  });

  it('does nothing if the device is incorrect (BTC addresses dont match)', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      derivationPath: DerivationPath.BIP44,
      account: {
        type: AccountType.PRIMARY,
        index: 0,
        addressBTC: '0x1',
      },
    } as AccountWithSecrets);

    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x2');

    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(
      secretsServiceMock.storeBtcWalletPolicyDetails
    ).not.toHaveBeenCalled();

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: false,
      },
    });
  });

  it('stores the details if the device is correct for BIP44', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      derivationPath: DerivationPath.BIP44,
      id: 'wallet-id',
      account: {
        type: AccountType.PRIMARY,
        index: 1,
        addressBTC: '0x1',
      },
    } as AccountWithSecrets);
    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');

    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
      'xpub',
      1,
      networks.testnet
    );

    expect(secretsServiceMock.storeBtcWalletPolicyDetails).toHaveBeenCalledWith(
      'xpub',
      'masterFingerprint',
      'hmacHex',
      'name',
      'wallet-id'
    );

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: true,
      },
    });
  });

  it('stores the details if the device is correct for Ledger Live', async () => {
    secretsServiceMock.getActiveAccountSecrets.mockResolvedValue({
      secretType: SecretType.Ledger,
      derivationPath: DerivationPath.BIP44,
      id: 'wallet-id',
      account: {
        type: AccountType.PRIMARY,
        index: 1,
        addressBTC: '0x1',
      },
    } as AccountWithSecrets);

    (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');

    const handler = new StoreBtcWalletPolicyDetails(
      secretsServiceMock,
      networkServiceMock
    );

    const result = await handler.handle(request);

    expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
      'xpub',
      1,
      networks.testnet
    );

    expect(secretsServiceMock.storeBtcWalletPolicyDetails).toHaveBeenCalledWith(
      'xpub',
      'masterFingerprint',
      'hmacHex',
      'name',
      'wallet-id'
    );

    expect(result).toStrictEqual({
      ...request,
      result: {
        isCorrectDevice: true,
      },
    });
  });
});
