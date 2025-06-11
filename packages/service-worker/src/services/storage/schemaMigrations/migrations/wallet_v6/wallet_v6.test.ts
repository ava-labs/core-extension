import { AddressPublicKey } from '~/services/secrets/AddressPublicKey';
import { CommonError } from '@core/types';

import { expectToThrowErrorCode } from '@shared/tests/test-utils';

import walletV6Migration from './wallet_v6';
import { Schema } from './wallet_v6_schema';

jest.mock('~/services/secrets/AddressPublicKey');

describe('src/background/services/storage/schemaMigrations/migrations/wallet_v6', () => {
  const mockMnemonicSecrets: Schema['wallets'][number] = {
    id: 'mnemonic-id',
    name: 'mnemonic secrets',
    secretType: 'mnemonic',
    derivationPathSpec: 'bip44',
    extendedPublicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'",
        key: 'xpub',
        type: 'extended-pubkey',
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/9000'/0'",
        key: 'xpubxp',
        type: 'extended-pubkey',
      },
    ],
    mnemonic: 'test mnemonic',
    publicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/9000'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'ed25519',
        derivationPath: "m/44'/9000'/0'/0'/0'",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/1",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/9000'/0'/0/1",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'ed25519',
        derivationPath: "m/44'/9000'/0'/0'/1'",
        key: 'publicKey',
        type: 'address-pubkey',
      },
    ],
  };
  const mockLedgerSecrets: Schema['wallets'][number] = {
    id: 'ledgy',
    derivationPath: 'bip44',
    name: 'Ledger Wallet',
    secretType: 'ledger',
    derivationPathSpec: 'bip44',
    extendedPublicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'",
        key: 'ledger-xpub',
        type: 'extended-pubkey',
        btcWalletPolicyDetails: {
          hmacHex: 'hmacHex',
          masterFingerprint: 'masterFingerprint',
          name: 'name',
          xpub: 'ledger-xpub',
        },
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/9000'/0'",
        key: 'ledger-xpubxp',
        type: 'extended-pubkey',
      },
    ],
    publicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/9000'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
    ],
  };

  const mockCurrentSecrets: Schema = {
    wallets: [mockMnemonicSecrets, mockLedgerSecrets],
    importedAccounts: {
      pkey: {
        secretType: 'private-key',
        secret: 'privateKey',
      },
    },
    version: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if accounts for wallet are not present', async () => {
    await expectToThrowErrorCode(
      walletV6Migration.up({ ...mockCurrentSecrets, version: 4 } as any),
      CommonError.MigrationFailed,
    );
  });

  it('migrates to v6 correctly', async () => {
    jest.mocked(AddressPublicKey.fromSeedphrase).mockImplementation(
      (_, curve, derivationPath) =>
        ({
          toJSON: jest.fn().mockReturnValue({
            curve,
            derivationPath,
            key: 'publicKey',
            type: 'address-pubkey',
          }),
        }) as any,
    );

    const result = await walletV6Migration.up(mockCurrentSecrets);

    expect(result).toEqual({
      importedAccounts: mockCurrentSecrets.importedAccounts,
      wallets: [
        {
          ...mockMnemonicSecrets,
          publicKeys: [
            ...mockMnemonicSecrets.publicKeys,
            {
              curve: 'ed25519',
              derivationPath: "m/44'/501'/0'/0'",
              key: 'publicKey',
              type: 'address-pubkey',
            },
            {
              curve: 'ed25519',
              derivationPath: "m/44'/501'/1'/0'",
              key: 'publicKey',
              type: 'address-pubkey',
            },
          ],
        },
        mockLedgerSecrets,
      ],
      version: 6,
    });
  });
});
