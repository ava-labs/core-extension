import { container } from 'tsyringe';
import { Avalanche, DerivationPath } from '@avalabs/core-wallets-sdk';

import { CallbackManager } from '@src/background/runtime/CallbackManager';

import {
  Account,
  AccountType,
  ImportType,
  PrimaryAccount,
} from '../accounts/models';
import { NetworkService } from '../network/NetworkService';
import { StorageService } from '../storage/StorageService';
import { PubKeyType, WALLET_STORAGE_KEY } from '../wallet/models';

import { SecretType } from './models';
import { SecretsService } from './SecretsService';
import { WalletConnectService } from '../walletConnect/WalletConnectService';

jest.mock('../storage/StorageService');
jest.mock('../network/NetworkService');
jest.mock('@avalabs/core-wallets-sdk');
jest.mock('tsyringe', () => {
  const tsyringe = jest.requireActual('tsyringe');

  return {
    ...tsyringe,
    container: {
      ...tsyringe.container,
      resolve: jest.fn(),
    },
  };
});

const walletId = 'wallet-id';

const evmAddress = '0x000000000';
const btcAddress = 'btc000000000';
const avmAddress = 'X-';
const pvmAddress = 'P-';
const coreEthAddress = 'C-';
const activeAccountData = {
  index: 0,
  id: 'uuid1',
  name: 'Account 1',
  type: AccountType.PRIMARY,
  walletId,
  addressC: evmAddress,
  addressBTC: btcAddress,
  addressAVM: avmAddress,
  addressPVM: pvmAddress,
  addressCoreEth: coreEthAddress,
};

const ACTIVE_WALLET_ID = 'active-wallet-id';
describe('src/background/services/secrets/SecretsService.ts', () => {
  const storageService = jest.mocked(new StorageService({} as CallbackManager));
  const networkService = jest.mocked(
    new NetworkService(storageService, {} as any)
  );
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
    jest.mocked(container.resolve).mockReturnValue({
      activeAccount,
      getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
    });
    getAddressMock = jest.fn().mockImplementation((pubkey, chain) => {
      return `${chain}-`;
    });

    getDefaultFujiProviderMock = jest.fn().mockReturnValue({
      getAddress: getAddressMock,
    });

    Avalanche.JsonRpcProvider = {
      getDefaultFujiProvider: getDefaultFujiProviderMock,
    } as any;

    networkService.getAvalanceProviderXP.mockReturnValue(
      getDefaultFujiProviderMock()
    );

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
          derivationPath: DerivationPath.BIP44,
          id: 'mnemonic-wallet',
        },
        {
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          name: 'Ledger 01',
          derivationPath: DerivationPath.BIP44,
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

  const mockMnemonicWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }
    const data = {
      wallets: [
        {
          secretType: SecretType.Mnemonic,
          mnemonic: 'mnemonic',
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
        },
      ],
      ...additionalData,
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockKeystoneWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValueOnce({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          secretType: SecretType.Keystone,
          masterFingerprint: 'masterFingerprint',
          xpub: 'xpub',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValueOnce({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPath: DerivationPath.BIP44,
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.Ledger,
          ...additionalData,
        },
      ],
    };
    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  const mockLedgerLiveWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    if (account) {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    }

    const data = {
      wallets: [
        {
          derivationPath: DerivationPath.LedgerLive,
          pubKeys: [{ evm: 'evm', xp: 'xp' }],
          id: ACTIVE_WALLET_ID,
          secretType: SecretType.LedgerLive,
          ...additionalData,
        },
      ],
    };

    jest.spyOn(storageService, 'load').mockResolvedValue(data);

    return data;
  };

  describe('getPrimaryAccountSecrets', () => {
    it('returns null if no secrets are saved', async () => {
      storageService.load.mockResolvedValue(null);

      await expect(secretsService.getPrimaryAccountSecrets()).resolves.toBe(
        null
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

      await expect(secretsService.getPrimaryAccountSecrets()).resolves.toEqual(
        walletSecrets
      );
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
          derivationPath: wallet.derivationPath,
        }))
      );
    });
  });

  describe('addSecrets()', () => {
    it('should save a new wallet to the `wallets` array', async () => {
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
        derivationPath: DerivationPath.BIP44,
        xpub: 'xpib',
        xpubXP: 'xpubXP',
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
            derivationPath: DerivationPath.BIP44,
            xpub: 'xpib',
            xpubXP: 'xpubXP',
            name: 'walletName',
          },
        ],
      });
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
        xpub: 'xpub',
        wallets: existingWallets,
      };
      storageService.load.mockResolvedValue(existingSecrets);
      await secretsService.addSecrets({
        mnemonic: 'mnemonic',
        secretType: SecretType.Mnemonic,
        derivationPath: DerivationPath.BIP44,
        xpub: 'xpib',
        xpubXP: 'xpubXP',
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            mnemonic: 'mnemonic',
            secretType: SecretType.Mnemonic,
            derivationPath: DerivationPath.BIP44,
            xpub: 'xpib',
            xpubXP: 'xpubXP',
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
        derivationPath: DerivationPath.BIP44,
        xpub: 'xpub',
        xpubXP: 'xpubXP',
      });
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [
          { ...existingSecrets.wallets[0] },
          {
            id: uuid,
            secretType: SecretType.Ledger,
            derivationPath: DerivationPath.BIP44,
            xpub: 'xpub',
            xpubXP: 'xpubXP',
            name: 'Ledger 02',
          },
        ],
      });
    });
  });

  describe('updateSecrets', () => {
    it('does not implicitly remove existing secrets in storage', async () => {
      const existingSecrets = {
        xpub: 'xpub',
        wallets: [
          {
            id: ACTIVE_WALLET_ID,
          },
        ],
      };
      storageService.load.mockResolvedValue(existingSecrets);

      await secretsService.updateSecrets(
        { xpubXP: 'xpubXP' },
        ACTIVE_WALLET_ID
      );

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        ...existingSecrets,
        wallets: [{ ...existingSecrets.wallets[0], xpubXP: 'xpubXP' }],
      });
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
        secretsService.getActiveAccountSecrets(activeAccountData)
      ).rejects.toThrow('Wallet is not initialized');
    });

    describe('when no account is active', () => {
      beforeEach(() => {
        mockLedgerLiveWallet();

        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: undefined,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
      });

      it('should throw an error because there is no active account', async () => {
        expect(
          async () =>
            await secretsService.getActiveAccountSecrets(activeAccountData)
        ).rejects.toThrow();
      });
    });

    describe('when a primary account is active', () => {
      const account = {
        type: AccountType.PRIMARY,
        index: 0,
        walletId: ACTIVE_WALLET_ID,
      };

      beforeEach(() => {
        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: account,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
      });

      it('attaches the account object to the result', async () => {
        mockMnemonicWallet();
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );

        expect(result.account).toBe(account);
      });

      it('recognizes mnemonic wallets', async () => {
        const secrets = mockMnemonicWallet();
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          ...rest,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + BIP44 wallets', async () => {
        const secrets = mockLedgerWallet();
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          btcWalletPolicyDetails: undefined,
          ...rest,
          secretType: SecretType.Ledger,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Ledger + LedgerLive wallets', async () => {
        const secrets = mockLedgerLiveWallet();
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
          ...rest,
          secretType: SecretType.LedgerLive,
          id: ACTIVE_WALLET_ID,
        });
      });

      it('recognizes Keystone wallets', async () => {
        const secrets = mockKeystoneWallet();
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ...rest } = secrets.wallets[0];
        expect(result).toEqual({
          account,
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
        jest.mocked(container.resolve).mockReturnValue({
          activeAccount: account,
          getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
        });
        mockMnemonicWallet({
          importedAccounts: {
            [account.id]: secrets,
          },
        });
      });

      it(`returns the imported account's secrets along with the account`, async () => {
        const result = await secretsService.getActiveAccountSecrets(
          activeAccountData
        );

        expect(result).toEqual({
          secret: 'secret',
          secretType: SecretType.PrivateKey,
          account,
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        walletConnectService
      );

      expect(result).toEqual({
        pkAcc,
        fbAcc,
      });
      const { mnemonic, xpub, xpubXP, derivationPath, id } = secrets.wallets[0];
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        wallets: [
          {
            derivationPath,
            mnemonic,
            secretType: SecretType.Mnemonic,
            xpub,
            xpubXP,
            id,
          },
        ],
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
        wallets: [
          {
            derivationPath: DerivationPath.BIP44,
            id: 'active-wallet-id',
            mnemonic: 'mnemonic',
            secretType: SecretType.Mnemonic,
            xpub: 'xpub',
            xpubXP: 'xpubXP',
          },
        ],
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
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets(
        activeAccountData
      );

      expect(result).toEqual({
        addresses: { ...secrets.addresses },
        pubKey: { ...secrets.pubKey },
        secretType: SecretType.WalletConnect,
        account,
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
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: account,
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
      mockMnemonicWallet({
        importedAccounts: {
          [account.id]: secrets,
        },
      });
    });

    it(`returns the imported account's secrets along with the account`, async () => {
      const result = await secretsService.getActiveAccountSecrets(
        activeAccountData
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { secretType, ...rest } = secrets;
      expect(result).toEqual({
        ...rest,
        secretType: SecretType.Fireblocks,
        account,
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
        secretsService.getBtcWalletPolicyDetails()
      ).resolves.toBeUndefined();
    });

    it('returns the policy details correctly for Ledger Live', async () => {
      mockLedgerLiveWallet(
        {
          pubKeys: [
            null,
            {
              btcWalletPolicyDetails,
            } as PubKeyType,
          ],
        },
        { type: AccountType.PRIMARY, index: 1, walletId: ACTIVE_WALLET_ID }
      );

      await expect(secretsService.getBtcWalletPolicyDetails()).resolves.toEqual(
        {
          accountIndex: 1,
          details: btcWalletPolicyDetails,
        }
      );
    });

    it('returns the policy details correctly for Ledger + BIP44', async () => {
      mockLedgerWallet({
        btcWalletPolicyDetails,
      });

      await expect(secretsService.getBtcWalletPolicyDetails()).resolves.toEqual(
        {
          accountIndex: 0,
          details: btcWalletPolicyDetails,
        }
      );
    });
  });

  describe('isKnownSecret', () => {
    it('returns true when seed phrase is already stored', async () => {
      mockMnemonicWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'mnemonic')
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.Mnemonic, 'cinomenm')
      ).toBe(false);
    });
    it('returns true when Ledger is already stored', async () => {
      mockLedgerWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.Ledger, 'xpub')
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.Ledger, 'newxpub')
      ).toBe(false);
    });
    it('returns true when Ledger Live is already stored', async () => {
      mockLedgerLiveWallet();

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, [
          { evm: 'evm', xp: 'xp' },
        ])
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, [
          { evm: 'evm', xp: 'xp' },
          { evm: 'new evm', xp: 'new xp' },
        ])
      ).toBe(true);

      expect(
        await secretsService.isKnownSecret(SecretType.LedgerLive, [
          { evm: 'new evm', xp: 'new xp' },
        ])
      ).toBe(false);
    });
  });

  describe('storeBtcWalletPolicyDetails', () => {
    const hmacHex = '0x1';
    const xpub = '0x2';
    const masterFingerprint = '1234';
    const name = 'policy';

    beforeEach(() => {
      jest.mocked(container.resolve).mockReturnValue({
        activeAccount: {
          type: AccountType.PRIMARY,
          index: 0,
          walletId: ACTIVE_WALLET_ID,
        },
        getActiveWalletId: jest.fn().mockReturnValue(ACTIVE_WALLET_ID),
      });
    });

    const storeBtcWalletPolicyDetails = async () =>
      secretsService.storeBtcWalletPolicyDetails(
        xpub,
        masterFingerprint,
        hmacHex,
        name,
        ACTIVE_WALLET_ID,
        activeAccountData
      );

    it('throws if wallet type is not Ledger', async () => {
      mockMnemonicWallet();

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    });

    it('throws if storage is empty', async () => {
      await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
        'Wallet is not initialized'
      );
    });

    describe('Derivation path: Ledger Live', () => {
      it('throws if storage is empty for the given index', async () => {
        mockLedgerLiveWallet({
          pubKeys: [],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: missing record for the provided index.'
        );
      });

      it('throws if storage already contains policy info for the given index', async () => {
        mockLedgerLiveWallet({
          pubKeys: [
            {
              btcWalletPolicyDetails: {},
            },
          ],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerLiveWallet({
          pubKeys: [
            {
              evm: '0x1',
              xp: '0x2',
            },
          ],
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              derivationPath: existingSecrets.wallets[0]?.derivationPath,
              id: ACTIVE_WALLET_ID,
              secretType: SecretType.LedgerLive,
              pubKeys: [
                {
                  ...existingSecrets.wallets[0]?.pubKeys[0],
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

    describe('Derivation path: BIP44', () => {
      it('throws if storage is already contains policy', async () => {
        mockLedgerWallet({
          btcWalletPolicyDetails: {},
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrow(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        const existingSecrets = mockLedgerWallet();

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          wallets: [
            {
              id: ACTIVE_WALLET_ID,
              derivationPath: existingSecrets.wallets[0]?.derivationPath,
              btcWalletPolicyDetails: {
                xpub,
                masterFingerprint,
                hmacHex,
                name,
              },
              xpub: existingSecrets.wallets[0]?.xpub,
              xpubXP: existingSecrets.wallets[0]?.xpubXP,
              secretType: SecretType.Ledger,
            },
          ],
        });
      });
    });
  });
  /*
  describe('addAddress', () => {
    const addressesMock = {
      addressC: 'addressC',
      addressBTC: 'addressBTC',
      addressAVM: 'addressAVM',
      addressPVM: 'addressPVM',
      addressCoreEth: 'addressCoreEth',
    };
    let getAddressesSpy: jest.SpyInstance;

    beforeEach(() => {
      getAddressesSpy = jest.spyOn(walletService as any, 'getAddresses');
    });

    it('returns the result of getAddresses', async () => {
      mockMnemonicWallet();
      getAddressesSpy.mockReturnValueOnce(addressesMock);

      const result = await walletService.addAddress(1, WALLET_ID);
      expect(getAddressesSpy).toHaveBeenCalledWith(1, WALLET_ID);
      expect(result).toStrictEqual(addressesMock);
    });

    describe('ledger', () => {
      it('throws if transport is not available', async () => {
        mockLedgerLiveWallet({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = undefined;

        await expect(walletService.addAddress(1, WALLET_ID)).rejects.toThrow(
          'Ledger transport not available'
        );
      });

      it('throws when it fails to get EVM pubkey from ledger', async () => {
        const transportMock = {} as LedgerTransport;
        mockLedgerLiveWallet({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;

        (getPubKeyFromTransport as jest.Mock).mockReturnValueOnce(
          Buffer.from('')
        );

        await expect(walletService.addAddress(1, WALLET_ID)).rejects.toThrow(
          'Failed to get public key from device.'
        );
        expect(getPubKeyFromTransport).toHaveBeenCalledWith(
          transportMock,
          1,
          DerivationPath.LedgerLive
        );
      });

      it('throws when it fails to get X/P pubkey from ledger', async () => {
        const transportMock = {} as LedgerTransport;
        mockLedgerLiveWallet({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;

        (getPubKeyFromTransport as jest.Mock)
          .mockReturnValueOnce(Buffer.from('evm'))
          .mockReturnValueOnce(Buffer.from(''));

        await expect(walletService.addAddress(1, WALLET_ID)).rejects.toThrow(
          'Failed to get public key from device.'
        );
        expect(getPubKeyFromTransport).toHaveBeenCalledWith(
          transportMock,
          1,
          DerivationPath.LedgerLive
        );
      });

      it('uses pubkey if index is already known', async () => {
        const addressBuffEvm = Buffer.from('0x1');
        const addressBuffXP = Buffer.from('0x2');
        getAddressesSpy.mockReturnValueOnce(addressesMock);
        mockLedgerLiveWallet({
          pubKeys: [
            {
              evm: addressBuffEvm.toString('hex'),
              xp: addressBuffXP.toString('hex'),
            },
          ],
        });

        const result = await walletService.addAddress(0, WALLET_ID);
        expect(getAddressesSpy).toHaveBeenCalledWith(0, WALLET_ID);
        expect(getPubKeyFromTransport).not.toHaveBeenCalled();
        expect(result).toStrictEqual(addressesMock);
        expect(secretsService.updateSecrets).not.toHaveBeenCalled();
      });

      it('gets the addresses correctly', async () => {
        const addressBuffEvm = Buffer.from('0x1');
        const addressBuffXP = Buffer.from('0x2');
        const transportMock = {} as LedgerTransport;
        getAddressesSpy.mockReturnValueOnce(addressesMock);
        mockLedgerLiveWallet({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;
        (getPubKeyFromTransport as jest.Mock)
          .mockReturnValueOnce(addressBuffEvm)
          .mockReturnValueOnce(addressBuffXP);

        const result = await walletService.addAddress(0, WALLET_ID);
        expect(getAddressesSpy).toHaveBeenCalledWith(0, WALLET_ID);
        expect(result).toStrictEqual(addressesMock);
        expect(secretsService.updateSecrets).toHaveBeenCalledWith(
          {
            pubKeys: [
              {
                evm: addressBuffEvm.toString('hex'),
                xp: addressBuffXP.toString('hex'),
              },
            ],
          },
          WALLET_ID
        );
      });
    });

    describe('seedless', () => {
      const oldKeys = [{ evm: 'evm', xp: 'xp' }];
      const newKeys = [...oldKeys, { evm: 'evm2', xp: 'xp2' }];

      describe('when public keys for given account are not known yet', () => {
        beforeEach(() => {
          mockSeedlessWallet({
            pubKeys: oldKeys,
          });
          jest.mocked(SeedlessWallet).mockReturnValue(seedlessWalletMock);

          jest
            .spyOn(seedlessWalletMock, 'getPublicKeys')
            .mockResolvedValue(newKeys);

          jest
            .spyOn(walletService, 'getAddresses')
            .mockResolvedValueOnce(addressesMock as any);
        });

        it('calls addAccount on SeedlessWallet', async () => {
          const result = await walletService.addAddress(1, WALLET_ID);

          expect(SeedlessWallet).toHaveBeenCalledWith({
            networkService,
            sessionStorage: expect.any(SeedlessTokenStorage),
            addressPublicKey: { evm: 'evm', xp: 'xp' },
          });

          expect(seedlessWalletMock.addAccount).toHaveBeenCalledWith(1);
          expect(secretsService.updateSecrets).toHaveBeenCalledWith(
            {
              pubKeys: newKeys,
            },
            WALLET_ID
          );
          expect(getAddressesSpy).toHaveBeenCalledWith(1, WALLET_ID);
          expect(result).toStrictEqual(addressesMock);
        });
      });

      describe('when the public keys for the new account are known', () => {
        beforeEach(() => {
          mockSeedlessWallet({
            pubKeys: newKeys,
          });
        });

        it('retrieves the addresses without contacting seedless api', async () => {
          const addressBuffEvm = Buffer.from('0x1');
          const addressBuffXP = Buffer.from('0x2');

          getAddressesSpy.mockReturnValueOnce(addressesMock);

          jest
            .mocked(getPubKeyFromTransport)
            .mockReturnValueOnce(addressBuffEvm as any)
            .mockReturnValueOnce(addressBuffXP as any);

          const result = await walletService.addAddress(1, WALLET_ID);

          expect(SeedlessWallet).not.toHaveBeenCalled();
          expect(secretsService.updateSecrets).not.toHaveBeenCalled();

          expect(getAddressesSpy).toHaveBeenCalledWith(1, WALLET_ID);
          expect(result).toStrictEqual(addressesMock);
        });
      });
    });
  });
  */

  /*
  describe('getAddresses', () => {
    const addressesMock = (addressC: string, addressBTC: string) => ({
      [NetworkVMType.EVM]: addressC,
      [NetworkVMType.BITCOIN]: addressBTC,
      [NetworkVMType.AVM]: 'X-',
      [NetworkVMType.PVM]: 'P-',
      [NetworkVMType.CoreEth]: 'C-',
    });

    it('throws error if walletId is not provided', async () => {
      await expect(walletService.getAddresses(0, '')).rejects.toThrow(
        'Wallet id not provided'
      );
    });

    it('throws if storage is empty', async () => {
      mockMnemonicWallet({ secretType: 'unknown' });
      await expect(walletService.getAddresses(0, WALLET_ID)).rejects.toThrow(
        'No public key available'
      );
    });

    it('returns the addresses for xpub', async () => {
      mockLedgerWallet();
      (getAddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');
      (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x2');
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);
      await expect(
        walletService.getAddresses(0, WALLET_ID)
      ).resolves.toStrictEqual(addressesMock('0x1', '0x2'));
      expect(Avalanche.getAddressPublicKeyFromXpub).toBeCalledWith('xpubXP', 0);
      expect(getAddressFromXPub).toHaveBeenCalledWith('xpub', 0);
      expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
        'xpub',
        0,
        networks.testnet
      );
    });

    it('throws if ledger pubkey is missing from storage', async () => {
      mockLedgerLiveWallet({
        pubKeys: [],
      });
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);

      await expect(walletService.getAddresses(0, WALLET_ID)).rejects.toThrow(
        'Account not added'
      );
    });

    it('returns the addresses for pubKey', async () => {
      const pubKeyBuff = Buffer.from('pubKey', 'hex');
      mockLedgerLiveWallet({
        pubKeys: [{ evm: 'pubKey', xp: 'pubKeyXP' }],
      });
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);
      (getEvmAddressFromPubKey as jest.Mock).mockReturnValueOnce('0x1');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValueOnce('0x2');

      await expect(
        walletService.getAddresses(0, WALLET_ID)
      ).resolves.toStrictEqual(addressesMock('0x1', '0x2'));

      expect(getEvmAddressFromPubKey).toHaveBeenCalledWith(pubKeyBuff);
      expect(getBtcAddressFromPubKey).toHaveBeenCalledWith(
        pubKeyBuff,
        networks.testnet
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Buffer),
        'X'
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        2,
        expect.any(Buffer),
        'P'
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        3,
        expect.any(Buffer),
        'C'
      );
    });
  });
  */

  /*
  describe('addImportedWallet', () => {
    const pubKeyBuffer = Buffer.from('0x111', 'hex');

    beforeEach(() => {
      (networkService.isMainnet as jest.Mock).mockReturnValue(false);
      (getPublicKeyFromPrivateKey as jest.Mock).mockReturnValue(pubKeyBuffer);
      (getEvmAddressFromPubKey as jest.Mock).mockReturnValue('0x1');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValue('0x2');
    });

    it('saves the secret in storage', async () => {
      const uuid = 'some unique id';
      (crypto.randomUUID as jest.Mock).mockReturnValueOnce(uuid);
      mockMnemonicWallet({
        imported: {},
      });

      const result = await walletService.addImportedWallet({
        importType: ImportType.PRIVATE_KEY,
        data: 'privateKey',
      });

      expect(result).toStrictEqual({
        account: {
          id: uuid,
          addressBTC: '0x2',
          addressC: '0x1',
          addressAVM: 'X-',
          addressPVM: 'P-',
          addressCoreEth: 'C-',
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

    it('throws if unable to calculate public key', async () => {
      (getPublicKeyFromPrivateKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo');
      });

      mockMnemonicWallet({
        imported: {},
      });

      await expect(
        walletService.addImportedWallet({
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        })
      ).rejects.toThrow('Error while calculating addresses');
    });

    it('throws if unable to calculate EVM address', async () => {
      (getEvmAddressFromPubKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo');
      });

      mockMnemonicWallet({
        imported: {},
      });

      await expect(
        walletService.addImportedWallet({
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        })
      ).rejects.toThrow('Error while calculating addresses');
    });

    it('throws if unable to calculate BTC address', async () => {
      (getBtcAddressFromPubKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo');
      });

      mockMnemonicWallet({
        imported: {},
      });

      await expect(
        walletService.addImportedWallet({
          importType: ImportType.PRIVATE_KEY,
          data: 'privateKey',
        })
      ).rejects.toThrow('Error while calculating addresses');
    });
  });
  */

  /*
  describe('getImportedAddresses', () => {
    const pubKeyBuffer = Buffer.from('0x111', 'hex');

    beforeEach(() => {
      (networkService.isMainnet as jest.Mock).mockReturnValue(false);
      (getPublicKeyFromPrivateKey as jest.Mock).mockReturnValue(pubKeyBuffer);
      (getEvmAddressFromPubKey as jest.Mock).mockReturnValue('0x1');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValue('0x2');
    });

    it('throws if imported account is missing from storage', async () => {
      secretsService.getImportedAccountSecrets.mockRejectedValue(
        new Error('No secrets found for imported account')
      );

      await expect(walletService.getImportedAddresses('id')).rejects.toThrow(
        'No secrets found for imported account'
      );
    });

    it('throws if importType is not supported', async () => {
      secretsService.getImportedAccountSecrets.mockResolvedValue({
        secretType: 'unknown' as any,
        secret: 'secret',
      });

      await expect(walletService.getImportedAddresses('id')).rejects.toThrow(
        'Unsupported import type'
      );
    });

    it('throws if addresses are missing', async () => {
      secretsService.getImportedAccountSecrets.mockResolvedValue({
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      });
      (getEvmAddressFromPubKey as jest.Mock).mockReturnValueOnce('');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValueOnce('');

      await expect(walletService.getImportedAddresses('id')).rejects.toThrow(
        'Missing address'
      );
    });

    it('returns the addresses for PRIVATE_KEY correctly', async () => {
      secretsService.getImportedAccountSecrets.mockResolvedValue({
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      });

      const result = await walletService.getImportedAddresses('id');

      expect(result).toStrictEqual({
        addressBTC: '0x2',
        addressC: '0x1',
        addressAVM: 'X-',
        addressPVM: 'P-',
        addressCoreEth: 'C-',
      });

      expect(getPublicKeyFromPrivateKey).toHaveBeenCalledWith('secret');
      expect(getEvmAddressFromPubKey).toHaveBeenCalledWith(pubKeyBuffer);
      expect(getBtcAddressFromPubKey).toHaveBeenCalledWith(
        pubKeyBuffer,
        networks.testnet
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Buffer),
        'X'
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        2,
        expect.any(Buffer),
        'P'
      );
      expect(getAddressMock).toHaveBeenNthCalledWith(
        3,
        expect.any(Buffer),
        'C'
      );
    });
  });
  */

  /*
  describe('deleteImportedWallets', () => {
    it('deletes the provided ids from storage', async () => {
      mockMnemonicWallet({
        imported: {
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
      secretsService.deleteImportedWallets.mockResolvedValue({
        id2: {
          secretType: SecretType.PrivateKey,
          secret: 'secret2',
        },
        id3: {
          secretType: SecretType.PrivateKey,
          secret: 'secret3',
        },
      });

      await walletService.deleteImportedWallets(['id2', 'id3']);

      expect(secretsService.deleteImportedWallets).toHaveBeenCalledWith([
        'id2',
        'id3',
      ]);
    });
  });
  */
  /*
  describe('deletePrimaryWallets()', () => {
    it('should call the secretsService with the right ids', async () => {
      const ids = ['wallet-id', 'wallet-id-2'];
      await walletService.deletePrimaryWallets(ids);
      expect(secretsService.deletePrimaryWallets).toHaveBeenCalledWith(ids);
    });
  });
  describe('getWalletType()', () => {
    it('should call the secretsService with the right id', async () => {
      const id = 'wallet-id';
      await walletService.getWalletType(id);
      expect(secretsService.getWalletAccountsSecretsById).toHaveBeenCalledWith(
        id
      );
    });
  });
  */
});
