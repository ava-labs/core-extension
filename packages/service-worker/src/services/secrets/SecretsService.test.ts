import {
  Avalanche,
  DerivationPath,
  getLedgerExtendedPublicKey,
  getPubKeyFromTransport,
} from '@avalabs/core-wallets-sdk';
import { CallbackManager } from '~/runtime/CallbackManager';
import {
  Account,
  AccountType,
  ImportType,
  PrimaryAccount,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  WALLET_STORAGE_KEY,
  WalletEvents,
  LedgerError,
  SecretType,
} from '@core/types';
import { StorageService } from '../storage/StorageService';
import { SecretsService } from './SecretsService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { LedgerService } from '../ledger/LedgerService';
import { LedgerTransport } from '../ledger/LedgerTransport';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import * as utils from './utils';
import { expectToThrowErrorCode } from '@shared/tests/test-utils';
import { AddressResolver } from './AddressResolver';
import { getAvalancheExtendedKeyPath, mapVMAddresses } from '@core/common';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { AddressPublicKey } from './AddressPublicKey';

jest.mock('../storage/StorageService');
jest.mock('../walletConnect/WalletConnectService');
jest.mock('@avalabs/core-wallets-sdk');
jest.mock('../seedless/SeedlessWallet');
jest.mock('./utils/getAddressForHvm', () => {
  return {
    getAddressForHvm: jest.fn(),
  };
});
jest.mock('./utils/getAccountPrivateKeyFromMnemonic.ts', () => {
  return {
    getAccountPrivateKeyFromMnemonic: jest.fn(),
  };
});

const evmAddress = '0x000000000';
const btcAddress = 'btc000000000';
const avmAddress = 'X-';
const pvmAddress = 'P-';
const coreEthAddress = 'C-';
const hvmAddress = undefined;

const activeAccountData = {
  index: 0,
  id: 'uuid1',
  name: 'Account 1',
  type: AccountType.PRIMARY,
  walletId: 'active-wallet-id',
  addressC: evmAddress,
  addressBTC: btcAddress,
  addressAVM: avmAddress,
  addressPVM: pvmAddress,
  addressCoreEth: coreEthAddress,
  addressHvm: hvmAddress,
};

const WALLET_ID = 'wallet-id';

const ACTIVE_WALLET_ID = 'active-wallet-id';
describe('src/background/services/secrets/SecretsService.ts', () => {
  const storageService = jest.mocked(new StorageService({} as CallbackManager));
  const activeAccount = {
    type: AccountType.PRIMARY,
    walletId: ACTIVE_WALLET_ID,
  } as PrimaryAccount;

  const walletConnectService = new WalletConnectService({} as any);
  let secretsService: SecretsService;
  let getDefaultFujiProviderMock: jest.Mock;
  let getAddressMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    getAddressMock = jest.fn().mockImplementation((_pubkey, chain) => {
      return `${chain}-`;
    });

    getDefaultFujiProviderMock = jest.fn().mockReturnValue({
      getAddress: getAddressMock,
    });

    Avalanche.JsonRpcProvider = {
      getDefaultFujiProvider: getDefaultFujiProviderMock,
    } as any;

    secretsService = new SecretsService(storageService);
  });

  const mockMultipleWallets = () => {
    const data = {
      wallets: [
        {
          secretType: SecretType.Mnemonic,
          mnemonic: 'mnemonic',
          name: 'Recovery Phrase 01',
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPathSpec: DerivationPath.BIP44,
          id: 'mnemonic-wallet',
        },
        {
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          name: 'Ledger 01',
          derivationPathSpec: DerivationPath.BIP44,
          id: 'ledger-wallet',
          secretType: SecretType.Ledger,
        },
      ],
      importedAccounts: {
        pkeyAccount: {
          secretType: SecretType.PrivateKey,
          secret: 'secret',
        },
      },
    } as const;
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockMnemonicWallet = (additionalData = {}, additionalWallet = {}) => {
    const wallets = (additionalWalletData) => {
      if (Object.keys(additionalWalletData).length) {
        return [
          {
            secretType: SecretType.Mnemonic,
            mnemonic: 'mnemonic',
            extendedPublicKeys: [
              {
                key: 'xpub',
                derivationPath: EVM_BASE_DERIVATION_PATH,
                curve: 'secp256k1',
                type: 'extended-pubkey',
              },
              {
                key: 'xpubXP',
                derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
                curve: 'secp256k1',
                type: 'extended-pubkey',
              },
            ],
            publicKeys: [],
            derivationPathSpec: DerivationPath.BIP44,
            id: ACTIVE_WALLET_ID,
          },
          additionalWalletData,
        ];
      }
      return [
        {
          secretType: SecretType.Mnemonic,
          mnemonic: 'mnemonic',
          extendedPublicKeys: [
            {
              key: 'xpub',
              derivationPath: EVM_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
              type: 'extended-pubkey',
            },
            {
              key: 'xpubXP',
              derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
              type: 'extended-pubkey',
            },
          ],
          publicKeys: [],
          derivationPathSpec: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
        },
      ];
    };
    const data = {
      wallets: wallets(additionalWallet),
      ...additionalData,
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockKeystoneWallet = (additionalData = {}) => {
    const data = {
      wallets: [
        {
          secretType: SecretType.Keystone,
          masterFingerprint: 'masterFingerprint',
          extendedPublicKeys: [
            {
              key: 'xpub',
              derivationPath: EVM_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
              type: 'extended-pubkey',
            },
          ],
          publicKeys: [],
          derivationPathSpec: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerWallet = (additionalData = {}) => {
    const data = {
      wallets: [
        {
          extendedPublicKeys: [
            {
              key: 'xpub',
              derivationPath: EVM_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
              type: 'extended-pubkey',
            },
            {
              key: 'xpubXP',
              derivationPath: AVALANCHE_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
              type: 'extended-pubkey',
            },
          ],
          derivationPathSpec: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.Ledger,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerLiveWallet = (additionalData = {}) => {
    const data = {
      wallets: [
        {
          derivationPathSpec: DerivationPath.LedgerLive,
          publicKeys: [
            { type: 'address-pubkey', curve: 'secp256k1', key: 'evm' },
            { type: 'address-pubkey', curve: 'secp256k1', key: 'xp' },
          ],
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.LedgerLive,
          extendedPublicKeys: [],
          ...additionalData,
        },
      ],
    };

    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };
  const mockSeedlessWallet = (
    additionalData: any = {},
    account?: Partial<Account>,
  ) => {
    const data = {
      secretType: SecretType.Seedless,
      derivationPathSpec: DerivationPath.BIP44,
      publicKeys: [],
      walletId: WALLET_ID,
      name: 'seedles',
      userId: '123',
      userEmail: 'a@b.c',
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets = jest
      .fn()
      .mockResolvedValue(data as any);
    secretsService.getAccountSecrets = jest.fn().mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById = jest
      .fn()
      .mockResolvedValue(data as any);
    secretsService.getPrimaryWalletsDetails = jest.fn().mockResolvedValue([
      {
        type: data.secretType,
        derivationPathSpec: data.derivationPath,
        id: data.walletId,
        name: data.name,
        authProvider: data.authProvider,
        userEmail: data.userEmail,
        userId: data.userId,
      },
    ]);

    return data;
  };

  describe('onUnlock', () => {
    it('should emit the `WALLET_STATE_UPDATE` event with an empty array', async () => {
      const eventListener = jest.fn();
      secretsService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener,
      );
      await secretsService.onUnlock();
      expect(eventListener).toHaveBeenCalledWith([]);
    });
    it('should emit the `WALLET_STATE_UPDATE` event with the correct data', async () => {
      mockMnemonicWallet();
      const eventListener = jest.fn();
      secretsService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener,
      );
      await secretsService.onUnlock();
      expect(eventListener).toHaveBeenCalledWith([
        {
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          name: undefined,
          type: SecretType.Mnemonic,
        },
      ]);
    });
  });

  describe('getPrimaryAccountSecrets', () => {
    it('returns null if no secrets are saved', async () => {
      storageService.load.mockResolvedValue(null);

      await expect(secretsService.getPrimaryAccountSecrets()).resolves.toBe(
        null,
      );
    });

    it('should return the wallet object', async () => {
      const walletSecrets = {
        key: 'some-unknown-secret',
        id: ACTIVE_WALLET_ID,
      };
      storageService.load.mockResolvedValue({
        wallets: [walletSecrets],
      });

      await expect(
        secretsService.getPrimaryAccountSecrets(activeAccount),
      ).resolves.toEqual(walletSecrets);
    });
  });

  describe('getPrimaryWalletsDetails()', () => {
    it('lists details of primary wallets', async () => {
      const { wallets } = mockMultipleWallets();

      expect(await secretsService.getPrimaryWalletsDetails()).toEqual(
        wallets.map((wallet) => ({
          id: wallet.id,
          name: wallet.name,
          type: wallet.secretType,
          derivationPath: wallet.derivationPathSpec,
        })),
      );
    });
  });

  describe('addSecrets()', () => {
    it('should save a new wallet to the `wallets` array and emits the `WALLET_STATE_UPDATE` event', async () => {
      const eventListener = jest.fn();
      secretsService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener,
      );

      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      const existingWallets = [
        {
          isActive: true,
        },
      ];
      const existingSecrets = {
        xpub: 'xpub',
        wallets: existingWallets,
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.addSecrets({
        mnemonic: 'mnemonic',
        secretType: SecretType.Mnemonic,
        derivationPathSpec: DerivationPath.BIP44,
        extendedPublicKeys: [{}, {}] as any,
        publicKeys: [],
        name: 'walletName',
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            mnemonic: 'mnemonic',
            secretType: SecretType.Mnemonic,
            derivationPathSpec: DerivationPath.BIP44,
            extendedPublicKeys: [{}, {}],
            publicKeys: [],
            name: 'walletName',
          },
        ],
      });
      expect(eventListener).toHaveBeenCalled();
    });

    it('should save a new wallet to the `wallets` array with default name when name is missing', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      const existingWallets = [
        {
          isActive: true,
        },
      ];
      const existingSecrets = {
        extendedPublicKeys: [{ type: 'extended-pubkey', key: '1234' }],
        wallets: existingWallets,
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.addSecrets({
        mnemonic: 'mnemonic',
        secretType: SecretType.Mnemonic,
        derivationPathSpec: DerivationPath.BIP44,
        extendedPublicKeys: [{ type: 'extended-pubkey', key: '5678' }] as any,
        publicKeys: [{ type: 'address-pubkey', key: '1234' }] as any,
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            mnemonic: 'mnemonic',
            secretType: SecretType.Mnemonic,
            derivationPathSpec: DerivationPath.BIP44,
            extendedPublicKeys: [{ type: 'extended-pubkey', key: '5678' }],
            publicKeys: [{ type: 'address-pubkey', key: '1234' }],
            name: 'Recovery Phrase 01',
          },
        ],
      });
    });

    it('should save a new wallet to the `wallets` array with the next index', async () => {
      const uuid = 'uuid';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      const existingSecrets = {
        wallets: [
          {
            id: 'id01',
            secretType: SecretType.Ledger,
            name: 'Ledger 01',
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.addSecrets({
        secretType: SecretType.Ledger,
        derivationPathSpec: DerivationPath.BIP44,
        extendedPublicKeys: [{ type: 'extended-pubkey', key: '5678' }] as any,
        publicKeys: [],
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            secretType: SecretType.Ledger,
            derivationPathSpec: DerivationPath.BIP44,
            extendedPublicKeys: [{ type: 'extended-pubkey', key: '5678' }],
            publicKeys: [],
            name: 'Ledger 02',
          },
        ],
      });
    });
  });

  describe('updateSecrets', () => {
    it('does not implicitly remove existing secrets in storage and emit `WALLET_STATE_UPDATE` event', async () => {
      const eventListener = jest.fn();
      secretsService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener,
      );
      const existingSecrets = {
        extendedPublicKeys: [{ type: 'extended-pubkey', key: 'oldXpubXP' }],
        wallets: [
          {
            id: ACTIVE_WALLET_ID,
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);

      await secretsService.updateSecrets(
        {
          extendedPublicKeys: [
            { type: 'extended-pubkey', key: 'xpubXP' },
          ] as any,
        },
        ACTIVE_WALLET_ID,
      );

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          {
            ...existingSecrets.wallets[0],
            extendedPublicKeys: [{ type: 'extended-pubkey', key: 'xpubXP' }],
          },
        ],
      });

      expect(eventListener).toHaveBeenCalled();
    });
  });

  describe('deleteSecrets()', () => {
    it('should remove the secrets from the storage', async () => {
      const tempWalletId = 'removable-wallet-id';
      const existingSecrets = {
        wallets: [
          {
            id: ACTIVE_WALLET_ID,
          },
          {
            id: tempWalletId,
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.deleteSecrets(tempWalletId);

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [{ ...existingSecrets.wallets[0] }],
      });
    });
  });

  describe('getActiveAccountSecrets', () => {
    it('throws error if no secrets are saved', async () => {
      storageService.load.mockResolvedValue(null);

      await expect(
        secretsService.getAccountSecrets(activeAccountData),
      ).rejects.toThrow('Wallet is not initialized');
    });

    describe('when no account is active', () => {
      beforeEach(() => {
        mockLedgerLiveWallet();
      });

      it('should throw an error because there is no active account', async () => {
        expect(
          async () =>
            await secretsService.getAccountSecrets({
              ...activeAccountData,
              walletId: 'invalid-wallet-id',
            }),
        ).rejects.toThrow();
      });
    });

    describe('when a primary account is active', () => {
      const account = {
        type: AccountType.PRIMARY,
        index: 0,
        walletId: ACTIVE_WALLET_ID,
      };

      beforeEach(() => {});

      it('attaches the account object to the result', async () => {
        mockMnemonicWallet();
        const result =
          await secretsService.getAccountSecrets(activeAccountData);

        expect(result.account).toEqual({ ...activeAccountData, ...account });
      });

      it('recognizes mnemonic wallets', async () => {
        const secrets = mockMnemonicWallet();
        const result =
          await secretsService.getAccountSecrets(activeAccountData);

        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account: { ...account, ...activeAccountData },
          ...rest,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + BIP44 wallets', async () => {
        const secrets = mockLedgerWallet();
        const result =
          await secretsService.getAccountSecrets(activeAccountData);

        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account: { ...account, ...activeAccountData },
          btcWalletPolicyDetails: undefined,
          ...rest,
          secretType: SecretType.Ledger,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + LedgerLive wallets', async () => {
        const secrets = mockLedgerLiveWallet();
        const result =
          await secretsService.getAccountSecrets(activeAccountData);

        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account: { ...account, ...activeAccountData },
          ...rest,
          secretType: SecretType.LedgerLive,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Keystone wallets', async () => {
        const secrets = mockKeystoneWallet();
        const result =
          await secretsService.getAccountSecrets(activeAccountData);

        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account: { ...account, ...activeAccountData },
          ...rest,
          id: ACTIVE_WALLET_ID,
        });
      });
    });

    describe('when a PrivateKey-imported account is active', () => {
      const secrets = {
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      };
      const account = {
        type: AccountType.IMPORTED,
        id: 'abcd1234',
      };

      beforeEach(() => {
        mockMnemonicWallet({
          importedAccounts: {
            [account.id]: secrets,
          },
        });
      });

      it(`returns the imported account's secrets along with the account`, async () => {
        const result = await secretsService.getAccountSecrets({
          ...activeAccountData,
          ...account,
        });

        expect(result).toEqual({
          secret: 'secret',
          secretType: SecretType.PrivateKey,
          account: { ...activeAccountData, ...account },
        });
      });
    });
  });

  describe('getImportedAccountSecrets', () => {
    it('recognizes PrivateKey imports', async () => {
      mockMnemonicWallet({
        importedAccounts: {
          pk1: {
            secretType: SecretType.PrivateKey,
            secret: 'secret',
          },
        },
      });

      expect(await secretsService.getImportedAccountSecrets('pk1')).toEqual({
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      });
    });

    it('recognizes WalletConnect imports', async () => {
      const wcData = {
        secretType: SecretType.WalletConnect,
        pubKey: { evm: 'evm', xp: 'xp' },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        importedAccounts: {
          wc1: wcData,
        },
      });

      const { secretType, ...rest } = wcData;
      expect(await secretsService.getImportedAccountSecrets('wc1')).toEqual({
        ...rest,
        secretType: SecretType.WalletConnect,
      });
    });

    it('recognizes Fireblocks imports', async () => {
      const fbData = {
        secretType: SecretType.Fireblocks,
        api: {
          key: 'key',
          secret: 'secret',
        },
        addresses: { addressC: 'addressC' },
      };
      mockMnemonicWallet({
        importedAccounts: {
          fb1: fbData,
        },
      });

      const { secretType, ...rest } = fbData;
      expect(await secretsService.getImportedAccountSecrets('fb1')).toEqual({
        ...rest,
        secretType: SecretType.Fireblocks,
      });
    });
  });

  describe('saveImportedWallet', () => {
    const fbAcc = {
      type: ImportType.FIREBLOCKS,
      api: {
        key: 'key',
        secret: 'secret',
      },
      addresses: { addressC: 'addressC' },
    };
    let secrets;

    beforeEach(() => {
      secrets = mockMnemonicWallet({
        importedAccounts: {
          fbAcc,
        },
      });
    });

    it('adds new wallet data to storage', async () => {
      const pkAcc = {
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      } as const;

      await secretsService.saveImportedWallet('pkAcc', pkAcc);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      secrets;

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: [
          {
            ...secrets.wallets[0],
          },
        ],
        importedAccounts: {
          ...secrets.importedAccounts,
          pkAcc,
        },
      });
    });
  });

  describe('deleteImportedWallets', () => {
    const pkAcc = {
      secretType: SecretType.PrivateKey,
      secret: 'secret',
    };
    const wcAcc = {
      secretType: SecretType.WalletConnect,
      pubKey: { evm: 'evm', xp: 'xp' },
      addresses: { addressC: 'addressC' },
    };
    const fbAcc = {
      secretType: SecretType.Fireblocks,
      api: {
        key: 'key',
        secret: 'secret',
      },
      addresses: { addressC: 'addressC' },
    };
    let secrets;

    beforeEach(() => {
      secrets = mockMnemonicWallet({
        importedAccounts: {
          pkAcc,
          wcAcc,
          fbAcc,
        },
      });
    });

    it('removes specified wallet data from storage', async () => {
      const result = await secretsService.deleteImportedWallets(
        ['pkAcc', 'fbAcc'],
        walletConnectService,
      );

      expect(result).toEqual({
        pkAcc,
        fbAcc,
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: secrets.wallets,
        importedAccounts: {
          wcAcc,
        },
      });
    });
  });

  describe('deletePrimaryWallets()', () => {
    beforeEach(() => {
      mockMnemonicWallet();
    });
    it('should delete the provided wallet id', async () => {
      const result = await secretsService.deletePrimaryWallets([
        'active-wallet-id',
      ]);
      expect(result).toBe(1);
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: [],
      });
    });
    it('should delete nothing because the given id is not a primary wallet', async () => {
      const result = await secretsService.deletePrimaryWallets([
        'fake-wallet-id',
      ]);
      expect(result).toBe(0);
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: mockMnemonicWallet().wallets,
      });
    });
  });

  describe('when a WalletConnect-imported account is active', () => {
    const secrets = {
      secretType: SecretType.WalletConnect,
      addresses: {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      pubKey: {
        evm: 'evm',
        xp: 'xp',
      },
    };
    const account = {
      type: AccountType.WALLET_CONNECT,
      id: 'wc-1234',
    };

    beforeEach(() => {
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getAccountSecrets({
        ...activeAccountData,
        ...account,
      });

      expect(result).toEqual({
        addresses: { ...secrets.addresses },
        pubKey: { ...secrets.pubKey },
        secretType: SecretType.WalletConnect,
        account: { ...activeAccountData, ...account },
      });
    });
  });

  describe('when a Fireblocks-imported account is active', () => {
    const secrets = {
      secretType: SecretType.Fireblocks,
      addresses: {
        addressC: 'addressC',
        addressBTC: 'addressBTC',
      },
      api: {
        key: 'key',
        secret: 'secret',
      },
    };
    const account = {
      type: AccountType.FIREBLOCKS,
      id: 'fb-1234',
    };

    beforeEach(() => {
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getAccountSecrets({
        ...activeAccountData,
        ...account,
      });

      const { secretType, ...rest } = secrets;
      expect(result).toEqual({
        ...rest,
        secretType: SecretType.Fireblocks,
        account: {
          ...activeAccountData,
          ...account,
        },
      });
    });
  });

  describe('getBtcWalletPolicyDetails', () => {
    const btcWalletPolicyDetails = {
      hmacHex: '0x1',
      xpub: '0x2',
      masterFingerprint: '1234',
      name: 'policy',
    };

    it('returns undefined if wallet type is not Ledger', async () => {
      mockMnemonicWallet();

      await expect(
        secretsService.getBtcWalletPolicyDetails(activeAccountData),
      ).resolves.toBeUndefined();
    });

    it('returns the policy details correctly for Ledger Live', async () => {
      mockLedgerLiveWallet({
        publicKeys: [
          {
            type: 'address-pubkey',
            derivationPath: `m/44'/60'/1'/0/0`,
            btcWalletPolicyDetails,
          },
        ],
      });

      await expect(
        secretsService.getBtcWalletPolicyDetails({
          ...activeAccountData,
          type: AccountType.PRIMARY,
          index: 1,
          walletId: ACTIVE_WALLET_ID,
        }),
      ).resolves.toEqual({
        accountIndex: 1,
        details: btcWalletPolicyDetails,
      });
    });

    it('returns the policy details correctly for Ledger + BIP44', async () => {
      mockLedgerWallet({
        extendedPublicKeys: [
          { type: 'extended-pubkey', btcWalletPolicyDetails },
        ],
      });

      await expect(
        secretsService.getBtcWalletPolicyDetails(activeAccountData),
      ).resolves.toEqual({
        accountIndex: 0,
        details: btcWalletPolicyDetails,
      });
    });
  });

  describe('isKnownSecret', () => {
    it('returns true when seed phrase is already stored', async () => {
      mockMnemonicWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'mnemonic'),
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'cinomenm'),
      ).toBe(false);
    });
    it('returns true when Ledger is already stored', async () => {
      mockLedgerWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.Ledger, 'xpub'),
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.Ledger, 'newxpub'),
      ).toBe(false);
    });
    it('returns true when Ledger Live is already stored', async () => {
      mockLedgerLiveWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, 'evm'),
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, 'xp'),
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, 'new evm'),
      ).toBe(false);
    });
  });

  describe('storeBtcWalletPolicyDetails', () => {
    const hmacHex = '0x1';
    const xpub = '0x2';
    const masterFingerprint = '1234';
    const name = 'policy';

    beforeEach(() => {});

    const storeBtcWalletPolicyDetails = async () =>
      secretsService.storeBtcWalletPolicyDetails(
        xpub,
        masterFingerprint,
        hmacHex,
        name,
        ACTIVE_WALLET_ID,
        activeAccountData,
      );

    it('throws if wallet type is not Ledger', async () => {
      mockMnemonicWallet();

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
        'Error while saving wallet policy details: incorrect wallet type.',
      );
    });

    it('throws if storage is empty', async () => {
      await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
        'Wallet is not initialized',
      );
    });

    describe('Derivation path: Ledger Live', () => {
      it('throws if storage is empty for the given index', async () => {
        mockLedgerLiveWallet({
          publicKeys: [],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: missing record for the provided index.',
        );
      });

      it('throws if storage already contains policy info for the given index', async () => {
        mockLedgerLiveWallet({
          publicKeys: [
            {
              type: 'extended-pubkey',
              derivationPath: `m/44'/60'/${activeAccountData.index}'/0/0`,
              key: 'key',
              btcWalletPolicyDetails: {},
            },
          ],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: policy details already stored.',
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerLiveWallet({
          publicKeys: [
            {
              key: '0x1',
              type: 'address-pubkey',
              derivationPath: `m/44'/60'/${activeAccountData.index}'/0/0`,
              curve: 'secp256k1',
            },
            {
              key: '0x2',
              type: 'address-pubkey',
              derivationPath: `m/44'/9000'/${activeAccountData.index}'/0/0`,
              curve: 'secp256k1',
            },
          ],
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              derivationPathSpec:
                existingSecrets.wallets[0]?.derivationPathSpec,
              id: ACTIVE_WALLET_ID,
              secretType: SecretType.LedgerLive,
              extendedPublicKeys: [],
              publicKeys: [
                {
                  ...existingSecrets.wallets[0]?.publicKeys[0],
                  btcWalletPolicyDetails: {
                    xpub,
                    masterFingerprint,
                    hmacHex,
                    name,
                  },
                },
                existingSecrets.wallets[0]?.publicKeys[1],
              ],
            },
          ],
        });
      });
    });

    describe('Derivation path: BIP44', () => {
      it('throws if storage is already contains policy', async () => {
        mockLedgerWallet({
          extendedPublicKeys: [
            {
              ...utils.buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
              btcWalletPolicyDetails: {},
            },
          ],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: policy details already stored.',
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerWallet({
          extendedPublicKeys: [
            {
              ...utils.buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
            },
          ],
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              ...existingSecrets.wallets[0],
              extendedPublicKeys: [
                {
                  ...existingSecrets.wallets[0]?.extendedPublicKeys[0],
                  btcWalletPolicyDetails: {
                    xpub,
                    masterFingerprint,
                    hmacHex,
                    name,
                  },
                },
              ],
            },
          ],
        });
      });
    });
  });

  describe('addAddress', () => {
    let ledgerService: LedgerService;

    const addressResolver = {
      getDerivationPathsByVM: jest.fn(),
    } as any;
    beforeEach(() => {
      ledgerService = new LedgerService();
      addressResolver.getDerivationPathsByVM.mockImplementation(
        (accountIndex) => ({
          [NetworkVMType.EVM]: `m/44'/60'/0'/0/${accountIndex}`,
          [NetworkVMType.AVM]: `m/44'/9000'/${accountIndex}'/0/0`,
          [NetworkVMType.HVM]: `m/44'/9000'/0'/0'/${accountIndex}'`,
        }),
      );
    });

    describe('ledger', () => {
      it('throws if transport is not available', async () => {
        mockLedgerLiveWallet({
          publicKeys: [],
        });
        jest
          .spyOn(ledgerService, 'recentTransport', 'get')
          .mockReturnValue(undefined);

        await expectToThrowErrorCode(
          secretsService.addAddress({
            index: 1,
            walletId: ACTIVE_WALLET_ID,
            ledgerService,
            addressResolver,
          }),
          LedgerError.TransportNotFound,
        );
      });

      it('throws when it fails to get EVM pubkey from ledger', async () => {
        const transportMock = {} as LedgerTransport;
        mockLedgerLiveWallet({
          publicKeys: [],
        });

        jest
          .spyOn(ledgerService, 'recentTransport', 'get')
          .mockReturnValue(transportMock);

        (getPubKeyFromTransport as jest.Mock).mockReturnValueOnce(
          Buffer.from(''),
        );

        await expectToThrowErrorCode(
          secretsService.addAddress({
            index: 1,
            walletId: ACTIVE_WALLET_ID,
            ledgerService,
            addressResolver,
          }),
          LedgerError.NoExtendedPublicKeyReturned,
        );
        expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
          transportMock,
          false,
          EVM_BASE_DERIVATION_PATH,
        );
      });

      it('throws when it fails to get X/P pubkey from ledger', async () => {
        const transportMock = {} as LedgerTransport;
        mockLedgerLiveWallet({
          publicKeys: [],
          extendedPublicKeys: [
            {
              type: 'extended-pubkey',
              key: 'evm',
              derivationPath: EVM_BASE_DERIVATION_PATH,
              curve: 'secp256k1',
            },
          ],
        });
        jest
          .spyOn(ledgerService, 'recentTransport', 'get')
          .mockReturnValue(transportMock);

        (getLedgerExtendedPublicKey as jest.Mock).mockResolvedValueOnce('');

        jest
          .spyOn(AddressPublicKey, 'fromExtendedPublicKeys')
          .mockReturnValueOnce({ toJSON: () => ({ key: 'evm' }) } as any);

        await expectToThrowErrorCode(
          secretsService.addAddress({
            index: 1,
            walletId: ACTIVE_WALLET_ID,
            ledgerService,
            addressResolver,
          }),
          LedgerError.NoExtendedPublicKeyReturned,
        );
        expect(getLedgerExtendedPublicKey).toHaveBeenCalledWith(
          transportMock,
          false,
          getAvalancheExtendedKeyPath(1),
        );
      });

      it('uses pubkey if index is already known', async () => {
        jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(true);
        jest
          .spyOn(ledgerService, 'recentTransport', 'get')
          .mockReturnValue({} as LedgerTransport);

        const addressBuffEvm = Buffer.from('0x1');
        const addressBuffXP = Buffer.from('0x2');
        mockLedgerLiveWallet({
          publicKeys: [
            {
              type: 'address-pubkey',
              key: addressBuffEvm.toString('hex'),
              derivationPath: `m/44'/60'/0'/0/0`,
              curve: 'secp256k1',
            },
            {
              type: 'address-pubkey',
              key: addressBuffXP.toString('hex'),
              derivationPath: `m/44'/9000'/0'/0/0`,
              curve: 'secp256k1',
            },
          ],
        });

        await secretsService.addAddress({
          index: 0,
          walletId: ACTIVE_WALLET_ID,
          ledgerService,
          addressResolver,
        });
        secretsService.updateSecrets = jest.fn();
        expect(getPubKeyFromTransport).not.toHaveBeenCalled();
        expect(secretsService.updateSecrets).not.toHaveBeenCalled();
      });
    });

    describe('seedless', () => {
      const oldKeys = [
        {
          type: 'address-pubkey',
          key: 'xp',
          derivationPath: `m/44'/60'/0'/0/0`,
          curve: 'secp256k1',
        },
        {
          type: 'address-pubkey',
          key: 'evm',
          derivationPath: `m/44'/9000'/0'/0/0`,
          curve: 'secp256k1',
        },
      ];
      const newKeys = [
        ...oldKeys,
        {
          type: 'address-pubkey',
          key: 'xp2',
          derivationPath: `m/44'/60'/0'/0/1`,
          curve: 'secp256k1',
        },
        {
          type: 'address-pubkey',
          key: 'evm2',
          derivationPath: `m/44'/9000'/0'/0/1`,
          curve: 'secp256k1',
        },
      ];
      const seedlessWalletMock = Object.create(SeedlessWallet.prototype);

      describe('when public keys for given account are not known yet', () => {
        beforeEach(() => {
          mockSeedlessWallet({
            publicKeys: oldKeys,
          });
          jest.mocked(SeedlessWallet).mockReturnValue(seedlessWalletMock);

          jest
            .spyOn(seedlessWalletMock, 'getPublicKeys')
            .mockResolvedValue(newKeys);
        });

        it('calls addAccount on SeedlessWallet', async () => {
          secretsService.updateSecrets = jest.fn();

          await secretsService.addAddress({
            index: 1,
            walletId: ACTIVE_WALLET_ID,
            ledgerService,
            addressResolver,
          });

          expect(SeedlessWallet).toHaveBeenCalledWith({
            sessionStorage: expect.any(SeedlessTokenStorage),
            addressPublicKeys: oldKeys,
          });

          expect(seedlessWalletMock.addAccount).toHaveBeenCalledWith(1);
          expect(secretsService.updateSecrets).toHaveBeenCalledWith(
            {
              publicKeys: newKeys,
            },
            ACTIVE_WALLET_ID,
          );
        });
      });

      describe('when the public keys for the new account are known', () => {
        beforeEach(() => {
          mockSeedlessWallet({
            publicKeys: newKeys,
          });
          jest.spyOn(utils, 'hasPublicKeyFor').mockReturnValue(true);
        });

        it('does not update secrets', async () => {
          secretsService.updateSecrets = jest.fn();

          await secretsService.addAddress({
            index: 1,
            walletId: ACTIVE_WALLET_ID,
            ledgerService,
            addressResolver,
          });

          expect(SeedlessWallet).not.toHaveBeenCalled();
          expect(secretsService.updateSecrets).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('addImportedWallet', () => {
    const addressResolver = {
      getAddressesForSecretId: jest.fn(),
    } as unknown as AddressResolver;

    it('saves the secret in storage', async () => {
      secretsService.saveImportedWallet = jest.fn();

      const uuid = 'some unique id';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      mockMnemonicWallet({
        imported: {},
      });

      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockResolvedValue(utils.emptyAddresses());

      const result = await secretsService.addImportedWallet(
        {
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        },
        addressResolver,
      );

      expect(result).toStrictEqual({
        account: {
          id: uuid,
          ...mapVMAddresses(utils.emptyAddresses()),
        },
        commit: expect.any(Function),
      });

      // make sure the callback is correct
      expect(secretsService.saveImportedWallet).not.toHaveBeenCalled();
      await result.commit();
      expect(secretsService.saveImportedWallet).toHaveBeenCalledWith(uuid, {
        secretType: SecretType.PrivateKey,
        secret: 'privateKey',
      });
    });

    it('throws if unable to resolve addresses', async () => {
      jest
        .mocked(addressResolver.getAddressesForSecretId)
        .mockRejectedValueOnce(new Error('Error while calculating addresses'));

      mockMnemonicWallet({
        imported: {},
      });

      await expect(
        secretsService.addImportedWallet(
          {
            importType: ImportType.PRIVATE_KEY,
            data: 'privateKey',
          },
          addressResolver,
        ),
      ).rejects.toThrow('Error while calculating addresses');
    });
  });

  describe('deleteImportedWallets', () => {
    it('deletes the provided ids from storage', async () => {
      mockMnemonicWallet({
        importedAccounts: {
          id1: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret1',
          },
          id2: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret2',
          },
          id3: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret3',
          },
        },
      });

      const result = await secretsService.deleteImportedWallets(
        ['id2', 'id3'],
        walletConnectService,
      );

      expect(result).toEqual({
        id2: {
          type: ImportType.PRIVATE_KEY,
          secret: 'secret2',
        },
        id3: {
          type: ImportType.PRIVATE_KEY,
          secret: 'secret3',
        },
      });
    });
  });

  describe('deletePrimaryWallets()', () => {
    it('should call the secretsService with the right ids', async () => {
      mockMnemonicWallet();
      const ids = ['active-wallet-id'];
      const result = await secretsService.deletePrimaryWallets(ids);
      expect(result).toBe(1);
    });
  });

  describe('getWalletType()', () => {
    it('should call the secretsService with the right id', async () => {
      secretsService.getWalletAccountsSecretsById = jest.fn();
      mockMnemonicWallet();
      await secretsService.getWalletType(ACTIVE_WALLET_ID);
      expect(secretsService.getWalletAccountsSecretsById).toHaveBeenCalledWith(
        ACTIVE_WALLET_ID,
      );
    });
  });

  describe('appendPublicKeys()', () => {
    const existingWallet = {
      id: 'wallet1',
      secretType: SecretType.Mnemonic,
      publicKeys: [
        {
          derivationPath: "m/44'/501'/0'/0'",
          key: 'key1',
          type: 'address-pubkey',
          curve: 'ed25519',
        },
      ],
    } as const;
    const newKeys = [
      {
        derivationPath: "m/44'/501'/0'/0'",
        key: 'key1',
        type: 'address-pubkey',
        curve: 'ed25519',
      } as const,
      {
        derivationPath: "m/44'/501'/1'/0'",
        key: 'key2',
        type: 'address-pubkey',
        curve: 'ed25519',
      } as const,
      {
        derivationPath: "m/44'/501'/2'/0'",
        key: 'key3',
        type: 'address-pubkey',
        curve: 'ed25519',
      } as const,
    ];

    beforeEach(() => {
      jest.spyOn(secretsService, 'updateSecrets').mockResolvedValue('wallet1');
      jest
        .spyOn(secretsService, 'getSecretsById')
        .mockResolvedValue(existingWallet as any);
    });

    it('appends new public keys to an existing wallet', async () => {
      const result = await secretsService.appendPublicKeys('wallet1', newKeys);

      expect(result).toBe('wallet1');
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: newKeys,
        },
        'wallet1',
      );
    });

    it('does not duplicate existing keys', async () => {
      const result = await secretsService.appendPublicKeys('wallet1', [
        ...existingWallet.publicKeys,
        ...newKeys,
      ]);

      expect(result).toBe('wallet1');
      expect(secretsService.updateSecrets).toHaveBeenCalledWith(
        {
          publicKeys: newKeys,
        },
        'wallet1',
      );
    });

    it('should throw an error if wallet is not a primary wallet', async () => {
      jest.spyOn(secretsService, 'getSecretsById').mockResolvedValue({
        id: 'wallet1',
        secretType: SecretType.PrivateKey,
      } as any);

      await expect(
        secretsService.appendPublicKeys('wallet1', []),
      ).rejects.toThrow('Cannot append public keys to a non-primary wallet');
    });
  });
});
