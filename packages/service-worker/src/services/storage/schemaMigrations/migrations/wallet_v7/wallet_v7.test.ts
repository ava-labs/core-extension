import walletV7Migration from './wallet_v7';

import { LegacySchema } from './wallet_v7_schema';

describe('src/background/services/storage/schemaMigrations/migrations/wallet_v7', () => {
  const mockMnemonicSecrets: LegacySchema['wallets'][number] = {
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
    ],
    mnemonic: 'test mnemonic',
    publicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
    ],
  };
  const mockLedgerSecrets: LegacySchema['wallets'][number] = {
    id: 'ledgy',
    name: 'Ledger Live Wallet',
    secretType: 'ledger-live',
    derivationPathSpec: 'ledger_live',
    publicKeys: [
      {
        curve: 'secp256k1',
        derivationPath: "m/44'/60'/0'/0/0",
        key: 'publicKey',
        type: 'address-pubkey',
      },
    ],
  };

  const mockCurrentSecrets: LegacySchema = {
    wallets: [mockMnemonicSecrets, mockLedgerSecrets],
    importedAccounts: {
      pkey: {
        secretType: 'private-key',
        secret: 'privateKey',
      },
    },
    version: 6,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('migrates to v7 correctly', async () => {
    const result = await walletV7Migration.up(mockCurrentSecrets);

    expect(result).toEqual({
      importedAccounts: mockCurrentSecrets.importedAccounts,
      wallets: [
        mockMnemonicSecrets,
        {
          ...mockLedgerSecrets,
          extendedPublicKeys: [],
        },
      ],
      version: 7,
    });
  });
});
