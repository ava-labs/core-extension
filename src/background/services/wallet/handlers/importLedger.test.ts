import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { WalletService } from '../WalletService';
import { SecretsService } from '../../secrets/SecretsService';
import { AccountsService } from '../../accounts/AccountsService';
import { ImportLedgerHandler } from './importLedger';
import {
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
} from '../../secrets/models';
import {
  DerivationPath,
  getAddressDerivationPath,
} from '@avalabs/core-wallets-sdk';
import { buildRpcCall } from '@src/tests/test-utils';
import { buildExtendedPublicKey } from '../../secrets/utils';
import { AddressPublicKey } from '../../secrets/AddressPublicKey';

describe('src/background/services/wallet/handlers/importLedger', () => {
  const walletService = {
    addPrimaryWallet: jest.fn(),
  } as unknown as jest.Mocked<WalletService>;

  const accountsService = {
    addPrimaryAccount: jest.fn(),
    activateAccount: jest.fn(),
  } as unknown as jest.Mocked<AccountsService>;

  const secretsService = {
    isKnownSecret: jest.fn(),
    getWalletAccountsSecretsById: jest.fn(),
  } as unknown as jest.Mocked<SecretsService>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const handle = (params) => {
    const handler = new ImportLedgerHandler(
      walletService,
      accountsService,
      secretsService,
    );

    return handler.handle(
      buildRpcCall({
        id: '123',
        method: ExtensionRequest.WALLET_IMPORT_LEDGER,
        params: [params],
      }),
    );
  };

  it('returns an error if secret type is not ledger or ledger live', async () => {
    const { error } = await handle({ secretType: SecretType.Mnemonic });

    expect(error).toEqual(`Invalid type: ${SecretType.Mnemonic}`);
  });

  it('returns an error if Ledger is missing xpub', async () => {
    const { error } = await handle({ secretType: SecretType.Ledger });

    expect(error).toEqual('Missing required param: Need xpub or pubKeys');
  });
  it('returns an error if Ledger Live is missing pubKeys', async () => {
    const { error } = await handle({ secretType: SecretType.LedgerLive });

    expect(error).toEqual('Missing required param: Need xpub or pubKeys');
  });
  it('returns an error if the wallet is already imported', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(true);

    const { error } = await handle({
      secretType: SecretType.Ledger,
      xpub: 'xpubValue',
    });

    expect(error).toEqual('This wallet already exists');
  });
  it('should return with the id as `0` and the given `SecretType` after it checked the wallet is exist', async () => {
    secretsService.isKnownSecret.mockResolvedValueOnce(false);

    const { result } = await handle({
      secretType: SecretType.Ledger,
      xpub: 'xpubValue',
      name: 'name',
      dryRun: true,
    });

    expect(result).toEqual({
      id: '0',
      name: 'name',
      type: SecretType.Ledger,
    });
  });

  it('returns an ImportWalletResult if Ledger import is successful', async () => {
    const walletId = crypto.randomUUID();
    const xpubValue = 'xpubValue';
    const xpubXPValue = 'xpubXPValue';
    const nameValue = 'walletName';
    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.Ledger,
      extendedPublicKeys: [
        buildExtendedPublicKey(xpubValue, `m/44'/60'/0'/0/0`),
        buildExtendedPublicKey(xpubXPValue, `m/44'/9000'/0'/0/0`),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      id: walletId,
      name: nameValue,
    });

    const { result } = await handle({
      secretType: SecretType.Ledger,
      xpub: xpubValue,
      xpubXP: xpubXPValue,
      name: nameValue,
      numberOfAccountsToCreate: 2,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.Ledger,
      extendedPublicKeys: [
        buildExtendedPublicKey(xpubValue, EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey(xpubXPValue, AVALANCHE_BASE_DERIVATION_PATH),
      ],
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      name: nameValue,
    });

    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(2);

    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.Ledger,
      name: nameValue,
      id: walletId,
    });
  });

  it('handles the combination of extended keys and Solana public keys', async () => {
    const xpubValue = 'xpubValue';
    const xpubXPValue = 'xpubXPValue';
    const walletId = crypto.randomUUID();
    const pubKeysValue = [
      {
        evm: '',
        svm: 'pubKeySvm',
      },
      {
        evm: '',
        svm: 'pubKeySvm2',
      },
    ] as any;

    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.Ledger,
      publicKeys: [
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: "m/44'/501'/0'/0'",
          key: 'pubKeySvm',
        }).toJSON(),
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: "m/44'/501'/1'/0'",
          key: 'pubKeySvm2',
        }).toJSON(),
      ],
      extendedPublicKeys: [
        buildExtendedPublicKey(xpubValue, EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey(xpubXPValue, AVALANCHE_BASE_DERIVATION_PATH),
      ],
      derivationPathSpec: DerivationPath.BIP44,
      id: walletId,
      name: 'Ledger 01',
    });

    const { result } = await handle({
      secretType: SecretType.Ledger,
      xpub: xpubValue,
      xpubXP: xpubXPValue,
      pubKeys: pubKeysValue,
      numberOfAccountsToCreate: 2,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.Ledger,
      extendedPublicKeys: [
        buildExtendedPublicKey(xpubValue, EVM_BASE_DERIVATION_PATH),
        buildExtendedPublicKey(xpubXPValue, AVALANCHE_BASE_DERIVATION_PATH),
      ],
      publicKeys: [
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: "m/44'/501'/0'/0'",
          key: 'pubKeySvm',
        }).toJSON(),
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: "m/44'/501'/1'/0'",
          key: 'pubKeySvm2',
        }).toJSON(),
      ],
      derivationPathSpec: DerivationPath.BIP44,
    });

    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(2);
    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.Ledger,
      name: 'Ledger 01',
      id: walletId,
    });
  });

  it('only imports accounts with pubkeys', async () => {
    const walletId = crypto.randomUUID();
    const pubKeysValue = [
      {
        evm: 'pubKeyEvm',
        svm: 'pubKeySvm',
      },
    ] as any;
    const nameValue = 'walletName';
    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.LedgerLive,
      publicKeys: pubKeysValue,
      derivationPathSpec: DerivationPath.LedgerLive,
      id: walletId,
      name: nameValue,
    });

    const { result } = await handle({
      secretType: SecretType.LedgerLive,
      pubKeys: pubKeysValue,
      name: nameValue,
      numberOfAccountsToCreate: 2,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.LedgerLive,
      publicKeys: [
        AddressPublicKey.fromJSON({
          key: 'pubKeyEvm',
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(
            0,
            DerivationPath.LedgerLive,
            'EVM',
          ),
        }).toJSON(),
        AddressPublicKey.fromJSON({
          curve: 'ed25519',
          derivationPath: "m/44'/501'/0'/0'",
          key: 'pubKeySvm',
        }).toJSON(),
      ],
      derivationPathSpec: DerivationPath.LedgerLive,
      name: nameValue,
    });

    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(1);
    expect(accountsService.activateAccount).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      type: SecretType.LedgerLive,
      name: nameValue,
      id: walletId,
    });
  });

  it('imports max 3 accounts', async () => {
    const walletId = crypto.randomUUID();
    const pubKeysValue = [
      {
        evm: 'pubKeyEvm1',
      },
      {
        evm: 'pubKeyEvm2',
      },
      {
        evm: 'pubKeyEvm3',
      },
      {
        evm: 'pubKeyEvm4',
      },
    ] as any;
    const nameValue = 'walletName';
    secretsService.isKnownSecret.mockResolvedValueOnce(false);
    walletService.addPrimaryWallet.mockResolvedValue(walletId);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue({
      secretType: SecretType.LedgerLive,
      publicKeys: pubKeysValue,
      derivationPathSpec: DerivationPath.LedgerLive,
      id: walletId,
      name: nameValue,
    });

    const { result } = await handle({
      secretType: SecretType.LedgerLive,
      pubKeys: pubKeysValue,
      name: nameValue,
      numberOfAccountsToCreate: 4,
    });

    expect(walletService.addPrimaryWallet).toHaveBeenCalledWith({
      secretType: SecretType.LedgerLive,
      publicKeys: pubKeysValue.map((key, index) =>
        AddressPublicKey.fromJSON({
          key: key.evm,
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(
            index,
            DerivationPath.LedgerLive,
            'EVM',
          ),
        }).toJSON(),
      ),
      derivationPathSpec: DerivationPath.LedgerLive,
      name: nameValue,
    });

    expect(accountsService.addPrimaryAccount).toHaveBeenCalledTimes(3);

    expect(result).toEqual({
      type: SecretType.LedgerLive,
      name: nameValue,
      id: walletId,
    });
  });
});
