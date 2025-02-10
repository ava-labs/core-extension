import { AddressPublicKey } from '@src/background/services/secrets/AddressPublicKey';
import { CommonError } from '@src/utils/errors';

import walletV5Migration from './wallet_v5';
import * as Legacy from './legacyModels';
import { expectToThrowErrorCode } from '@src/tests/test-utils';

jest.mock('@src/background/services/secrets/AddressPublicKey');

describe('src/background/services/storage/schemaMigrations/migrations/wallet_v5', () => {
  const mockMnemonicSecrets: Legacy.MnemonicSecrets = {
    id: 'mnemonic',
    secretType: 'mnemonic',
    derivationPath: 'bip44',
    name: 'Seedphrase Wallet',
    mnemonic: 'test mnemonic',
    xpub: 'xpub',
    xpubXP: 'xpubXP',
  };
  const mockLedgerSecrets: Legacy.LedgerSecrets = {
    id: 'ledgy',
    derivationPath: 'bip44',
    name: 'Ledger Wallet',
    xpub: 'xpub',
    xpubXP: 'xpubXP',
    secretType: 'ledger',
    btcWalletPolicyDetails: {
      hmacHex: 'hmacHex',
      masterFingerprint: 'masterFingerprint',
      name: 'name',
      xpub: 'xpub',
    },
  };
  const mockKeystoneSecrets: Legacy.KeystoneSecrets = {
    id: 'keystone',
    derivationPath: 'bip44',
    name: 'Keystone Wallet',
    xpub: 'xpub',
    masterFingerprint: 'masterFingerprint',
    secretType: 'keystone',
  };
  const mockLedgerLiveSecrets: Legacy.LedgerLiveSecrets = {
    id: 'ledger-live',
    derivationPath: 'ledger_live',
    name: 'LedgerLive Wallet',
    secretType: 'ledger-live',
    pubKeys: [
      {
        evm: 'evm',
        xp: 'xp',
        btcWalletPolicyDetails: {
          hmacHex: 'hmacHex',
          masterFingerprint: 'masterFingerprint',
          name: 'name',
          xpub: 'xpub',
        },
      },
      {
        evm: 'evm2',
        xp: 'xp2',
      },
    ],
  };
  const mockSeedlessSecrets: Legacy.SeedlessSecrets = {
    id: 'seedless',
    derivationPath: 'bip44',
    name: 'Seedless Wallet',
    secretType: 'seedless',
    pubKeys: [
      {
        evm: 'evm',
        xp: 'xp',
      },
      {
        evm: 'evm2',
        xp: 'xp2',
      },
    ],
    authProvider: 'apple',
    seedlessSignerToken: {},
    userEmail: 'test@core.app',
    userId: 'testUserId',
  };

  const mockAccounts = {
    primary: {
      [mockMnemonicSecrets.id]: ['account1', 'account2'],
      [mockLedgerSecrets.id]: ['account1'],
      [mockKeystoneSecrets.id]: ['account1'],
      [mockLedgerLiveSecrets.id]: ['account1', 'account2'],
      [mockSeedlessSecrets.id]: ['account1', 'account2'],
    },
  };

  const mockCurrentSecrets: Legacy.LegacySchema = {
    wallets: [
      mockMnemonicSecrets,
      mockLedgerSecrets,
      mockKeystoneSecrets,
      mockLedgerLiveSecrets,
      mockSeedlessSecrets,
    ],
    importedAccounts: {
      pkey: {
        secretType: 'private-key',
        secret: 'privateKey',
      },
      'wc-acc': {
        secretType: 'wallet-connect',
        addresses: {
          addressC: 'walletConnectC',
          addressBTC: 'walletConnectBTC',
        },
        pubKey: {
          evm: 'evm',
          xp: 'xp',
        },
      },
      'fb-acc': {
        secretType: 'fireblocks',
        addresses: {
          addressC: 'fireblocksC',
          addressBTC: 'fireblocksBTC',
        },
        api: {
          vaultAccountId: 'vaultAccountId',
          key: 'key',
          secret: 'secret',
        },
      },
    },
    version: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if previous schema is not v4', async () => {
    await expectToThrowErrorCode(
      walletV5Migration.up(
        { ...mockCurrentSecrets, version: 3 } as any,
        mockAccounts,
      ),
      CommonError.MigrationFailed,
    );
  });
  it('should throw an error if accounts for wallet are not present', async () => {
    const mockAccountsWithoutWallet = {
      primary: {},
    };

    await expectToThrowErrorCode(
      walletV5Migration.up(mockCurrentSecrets, mockAccountsWithoutWallet),
      CommonError.MigrationFailed,
    );
  });

  it('migrates to v5 correctly', async () => {
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
    jest.mocked(AddressPublicKey.fromExtendedPublicKeys).mockImplementation(
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

    const result = await walletV5Migration.up(mockCurrentSecrets, mockAccounts);

    expect(result).toEqual({
      importedAccounts: mockCurrentSecrets.importedAccounts,
      wallets: [
        {
          id: mockMnemonicSecrets.id,
          name: mockMnemonicSecrets.name,
          derivationPathSpec: mockMnemonicSecrets.derivationPath,
          extendedPublicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'",
              key: mockMnemonicSecrets.xpub,
              type: 'extended-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/0'",
              key: mockMnemonicSecrets.xpubXP,
              type: 'extended-pubkey',
            },
          ],
          mnemonic: mockMnemonicSecrets.mnemonic,
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
          secretType: 'mnemonic',
        },
        {
          id: mockLedgerSecrets.id,
          name: mockLedgerSecrets.name,
          derivationPathSpec: mockLedgerSecrets.derivationPath,
          extendedPublicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'",
              key: mockLedgerSecrets.xpub,
              type: 'extended-pubkey',
              btcWalletPolicyDetails: mockLedgerSecrets.btcWalletPolicyDetails,
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/0'",
              key: mockLedgerSecrets.xpubXP,
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
          secretType: mockLedgerSecrets.secretType,
        },
        {
          id: mockKeystoneSecrets.id,
          name: mockKeystoneSecrets.name,
          derivationPathSpec: mockKeystoneSecrets.derivationPath,
          extendedPublicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'",
              key: mockKeystoneSecrets.xpub,
              type: 'extended-pubkey',
            },
          ],
          masterFingerprint: mockKeystoneSecrets.masterFingerprint,
          publicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'/0/0",
              key: 'publicKey',
              type: 'address-pubkey',
            },
          ],
          secretType: mockKeystoneSecrets.secretType,
        },
        {
          id: mockLedgerLiveSecrets.id,
          name: mockLedgerLiveSecrets.name,
          derivationPathSpec: mockLedgerLiveSecrets.derivationPath,
          publicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'/0/0",
              key: mockLedgerLiveSecrets.pubKeys[0]!.evm,
              type: 'address-pubkey',
              btcWalletPolicyDetails:
                mockLedgerLiveSecrets.pubKeys[0]!.btcWalletPolicyDetails,
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/0'/0/0",
              key: mockLedgerLiveSecrets.pubKeys[0]!.xp,
              type: 'address-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/1'/0/0",
              key: mockLedgerLiveSecrets.pubKeys[1]!.evm,
              type: 'address-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/1'/0/0",
              key: mockLedgerLiveSecrets.pubKeys[1]!.xp,
              type: 'address-pubkey',
            },
          ],
          secretType: mockLedgerLiveSecrets.secretType,
        },
        {
          id: mockSeedlessSecrets.id,
          name: mockSeedlessSecrets.name,
          derivationPathSpec: mockSeedlessSecrets.derivationPath,
          authProvider: mockSeedlessSecrets.authProvider,
          seedlessSignerToken: mockSeedlessSecrets.seedlessSignerToken,
          userEmail: mockSeedlessSecrets.userEmail,
          userId: mockSeedlessSecrets.userId,
          publicKeys: [
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'/0/0",
              key: mockLedgerLiveSecrets.pubKeys[0]!.evm,
              type: 'address-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/0'/0/0",
              key: mockSeedlessSecrets.pubKeys[0]!.xp,
              type: 'address-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/60'/0'/0/1",
              key: mockSeedlessSecrets.pubKeys[1]!.evm,
              type: 'address-pubkey',
            },
            {
              curve: 'secp256k1',
              derivationPath: "m/44'/9000'/0'/0/1",
              key: mockSeedlessSecrets.pubKeys[1]!.xp,
              type: 'address-pubkey',
            },
          ],
          secretType: mockSeedlessSecrets.secretType,
        },
      ],
      version: 5,
    });
  });
});
