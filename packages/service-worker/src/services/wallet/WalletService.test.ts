import { BaseWallet, HDNodeWallet, SigningKey, Wallet } from 'ethers';

import { WalletService } from './WalletService';
import { AddressPublicKeyJson, MessageType } from '@core/types';
import { NetworkService } from '../network/NetworkService';
import { LedgerService } from '../ledger/LedgerService';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import {
  AddPrimaryWalletSecrets,
  AvalancheTransactionRequest,
  AVALANCHE_BASE_DERIVATION_PATH,
  EVM_BASE_DERIVATION_PATH,
  SecretType,
  Account,
  AccountType,
  SecretsError,
} from '@core/types';
import { AVALANCHE_XP_TEST_NETWORK } from '@avalabs/core-chains-sdk';
import {
  BitcoinLedgerWallet,
  BitcoinWallet,
  BitcoinProvider,
  DerivationPath,
  getPublicKeyFromPrivateKey,
  getAddressDerivationPath,
  Avalanche,
  createWalletPolicy,
  LedgerSigner,
  getWalletFromMnemonic,
} from '@avalabs/core-wallets-sdk';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
import { LedgerTransport } from '../ledger/LedgerTransport';
import getDerivationPath from './utils/getDerivationPath';
import ensureMessageFormatIsValid from './utils/ensureMessageFormatIsValid';
import { KeystoneService } from '../keystone/KeystoneService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { WalletPolicy } from 'ledger-bitcoin';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { WalletConnectStorage } from '../walletConnect/WalletConnectStorage';
import { WalletConnectSigner } from '../walletConnect/WalletConnectSigner';
import { Action, ActionStatus } from '@core/types';
import { UnsignedTx } from '@avalabs/avalanchejs';
import { FireblocksService } from '../fireblocks/FireblocksService';
import { SecretsService } from '../secrets/SecretsService';
import { Transaction } from 'bitcoinjs-lib';
import { SeedlessSessionManager } from '../seedless/SeedlessSessionManager';
import { Network } from '@core/types';
import { decorateWithCaipId, getLegacyXPDerivationPath } from '@core/common';
import { AccountsService } from '../accounts/AccountsService';
import { ed25519 } from '@noble/curves/ed25519';
import { HVMWallet } from './HVMWallet';
import { TransactionPayload, VMABI } from 'hypersdk-client';
import {
  buildAddressPublicKey,
  buildExtendedPublicKey,
} from '../secrets/utils';
import { expectToThrowErrorCode } from '@shared/tests/test-utils';
import { AddressResolver } from '../secrets/AddressResolver';
import { hex } from '@scure/base';
import { NetworkVMType } from '@avalabs/vm-module-types';

jest.mock('../network/NetworkService');
jest.mock('../secrets/SecretsService');
jest.mock('../secrets/AddressResolver');
jest.mock('../ledger/LedgerService');
jest.mock('../keystone/KeystoneService');
jest.mock('./utils/prepareBtcTxForLedger');
jest.mock('./utils/ensureMessageFormatIsValid');
jest.mock('@avalabs/core-wallets-sdk');
jest.mock('@noble/curves/ed25519', () => {
  return {
    ed25519: {
      getPublicKey: jest.fn(),
    },
  };
});
jest.mock('./utils/getDerivationPath');
jest.mock('../seedless/SeedlessWallet');
jest.mock('../seedless/SeedlessSessionManager');

jest.mock('@metamask/eth-sig-util', () => {
  const personalSignMock = jest.fn();
  const signTypedDataMock = jest.fn();
  const signTypedDataVersionMock = jest.fn();
  return {
    personalSign: personalSignMock,
    signTypedData: signTypedDataMock,
    SignTypedDataVersion: signTypedDataVersionMock,
  };
});

describe('background/services/wallet/WalletService.ts', () => {
  let walletService: WalletService;
  let networkService: NetworkService;
  let ledgerService: LedgerService;
  let keystoneService: KeystoneService;
  let walletConnectService: WalletConnectService;
  let fireblocksService: FireblocksService;
  let addressResolver: AddressResolver;
  let secretsService: jest.Mocked<SecretsService>;
  const accountsService: jest.Mocked<AccountsService> = {
    getActiveAccount: async () => ({
      type: AccountType.PRIMARY,
      index: 0,
    }),
  } as any;

  const privateKeyMock =
    '4ae3e293d0161fa90bfbf51028ceb1e51fe70bc6167afe4e0fe0927d86555503';
  const walletMock = new BaseWallet(new SigningKey('0x' + privateKeyMock));
  const btcWalletMock = Object.create(BitcoinWallet.prototype);
  const hvmWalletMock = new HVMWallet('0x' + privateKeyMock);
  const btcLedgerWalletMock = Object.create(BitcoinLedgerWallet.prototype);
  const btcKeystoneWalletMock = Object.create(BitcoinKeystoneWallet.prototype);
  const staticSignerMock = Object.create(Avalanche.StaticSigner.prototype);
  const simpleSignerMock = Object.create(Avalanche.SimpleSigner.prototype);
  const ledgerSignerMock = Object.create(Avalanche.LedgerSigner.prototype);
  const ledgerLiveSignerMock = Object.create(
    Avalanche.LedgerLiveSigner.prototype,
  );
  const evmLedgerSignerMock = Object.create(LedgerSigner.prototype);
  const ledgerSimpleSignerMock = Object.create(
    Avalanche.SimpleLedgerSigner.prototype,
  );
  const keystoneWalletMock = Object.create(KeystoneWallet.prototype);
  const walletConnectSignerMock = Object.create(WalletConnectSigner.prototype);
  const seedlessWalletMock = Object.create(SeedlessWallet.prototype);
  const mnemonic = 'mnemonic';

  const getDerivationPathsByVM = jest.fn();

  let getDefaultFujiProviderMock: jest.Mock;
  let getAddressMock: jest.Mock;

  const WALLET_ID = 'wallet-id';

  const extendedPublicKeys = [
    buildExtendedPublicKey('xpub', EVM_BASE_DERIVATION_PATH),
    buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
  ];

  const mockMnemonicWallet = (
    additionalData: any = {},
    account?: Partial<Account>,
  ) => {
    const data = {
      secretType: SecretType.Mnemonic,
      mnemonic: 'mnemonic',
      extendedPublicKeys,
      publicKeys: [],
      derivationPathSpec: DerivationPath.BIP44,
      walletId: WALLET_ID,
      name: 'mnemonic',
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);
    secretsService.getPrimaryWalletsDetails.mockResolvedValue([
      {
        type: data.secretType,
        derivationPath: data.derivationPathSpec,
        id: data.walletId,
        name: data.name,
      },
    ]);

    return data;
  };

  const mockLedgerWallet = (
    additionalData: any = {},
    account?: Partial<Account>,
  ) => {
    const data = {
      secretType: SecretType.Ledger,
      derivationPathSpec: DerivationPath.BIP44,
      walletId: WALLET_ID,
      name: 'ledger',
      publicKeys: [
        {
          key: 'evm',
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(0, 'EVM', {
            pathSpec: DerivationPath.BIP44,
          }),
        },
        {
          key: 'xp',
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(0, 'AVM', {
            pathSpec: DerivationPath.BIP44,
          }),
        },
      ],
      extendedPublicKeys: [],
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);
    secretsService.getPrimaryWalletsDetails.mockResolvedValue([
      {
        type: data.secretType,
        derivationPath: data.derivationPathSpec,
        id: data.walletId,
        name: data.name,
      },
    ]);

    return data;
  };

  const mockLedgerLiveWallet = (
    additionalData = {},
    account?: Partial<Account>,
  ) => {
    const data = {
      secretType: SecretType.LedgerLive,
      derivationPath: DerivationPath.LedgerLive,
      publicKeys: [
        {
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(0, 'EVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
          key: 'evm',
        },
        {
          key: 'xp',
          curve: 'secp256k1',
          derivationPath: getAddressDerivationPath(0, 'AVM', {
            pathSpec: DerivationPath.LedgerLive,
          }),
        },
      ],
      walletId: WALLET_ID,
      name: 'ledger live',
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);
    secretsService.getPrimaryWalletsDetails.mockResolvedValue([
      {
        type: data.secretType,
        derivationPath: data.derivationPath,
        id: data.walletId,
        name: data.name,
      },
    ]);

    return data;
  };

  const mockSeedlessWallet = (
    additionalData: any = {},
    account?: Partial<Account>,
  ) => {
    const data = {
      secretType: SecretType.Seedless,
      derivationPath: DerivationPath.BIP44,
      publicKeys: [{ evm: 'evm', xp: 'xp' }],
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
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);
    secretsService.getPrimaryWalletsDetails.mockResolvedValue([
      {
        type: data.secretType,
        derivationPath: data.derivationPath,
        id: data.walletId,
        name: data.name,
        authProvider: data.authProvider,
        userEmail: data.userEmail,
        userId: data.userId,
      },
    ]);

    return data;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    networkService = new NetworkService({} as any, {} as any, {} as any);
    ledgerService = new LedgerService();
    keystoneService = new KeystoneService();

    walletConnectService = new WalletConnectService(
      new WalletConnectStorage({} as any),
    );
    fireblocksService = new FireblocksService({} as any);

    secretsService = jest.mocked(new SecretsService({} as any));
    addressResolver = jest.mocked({ getDerivationPathsByVM } as any);

    secretsService.getPrimaryWalletsDetails = jest.fn().mockResolvedValue([]);

    jest
      .mocked(getAddressDerivationPath)
      .mockImplementation((index, vm, options) => {
        const coin = vm === 'EVM' ? 60 : 9000;

        return options?.pathSpec === DerivationPath.BIP44
          ? `m/44'/${coin}'/0'/0/${index}`
          : `m/44'/${coin}'/${index}'/0/0`;
      });

    getAddressMock = jest.fn().mockImplementation((_pubkey, chain) => {
      return `${chain}-`;
    });

    getDefaultFujiProviderMock = jest.fn().mockReturnValue({
      getAddress: getAddressMock,
    });

    Avalanche.JsonRpcProvider = {
      getDefaultFujiProvider: getDefaultFujiProviderMock,
    } as any;

    walletService = new WalletService(
      networkService,
      ledgerService,
      keystoneService,
      walletConnectService,
      fireblocksService,
      secretsService,
      accountsService,
      addressResolver,
    );

    (networkService.getAvalanceProviderXP as jest.Mock).mockReturnValue(
      Avalanche.JsonRpcProvider.getDefaultFujiProvider(),
    );
    (getWalletFromMnemonic as jest.Mock).mockReturnValue({
      path: 'derivePath',
      privateKey: '123123123',
    });
  });

  describe('onUnlock', () => {
    it('returns early if storage is empty', async () => {
      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      const wallets = await secretsService.getPrimaryWalletsDetails();
      expect(wallets).toEqual([]);
    });

    it('sets the walletType as mnemonic', async () => {
      mockMnemonicWallet();
      const wallets = await secretsService.getPrimaryWalletsDetails();

      expect(wallets).toEqual([
        {
          id: WALLET_ID,
          type: SecretType.Mnemonic,
          derivationPath: DerivationPath.BIP44,
          name: 'mnemonic',
        },
      ]);
    });

    it('sets the walletType as ledger if xpub is present', async () => {
      mockLedgerWallet();

      const wallets = await secretsService.getPrimaryWalletsDetails();

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(wallets).toEqual([
        {
          id: WALLET_ID,
          type: SecretType.Ledger,
          derivationPath: DerivationPath.BIP44,
          name: 'ledger',
        },
      ]);
    });

    it('sets the walletType as ledger if pubKeys is present', async () => {
      mockLedgerLiveWallet();

      const wallets = await secretsService.getPrimaryWalletsDetails();

      expect(wallets).toEqual([
        {
          id: WALLET_ID,
          type: SecretType.LedgerLive,
          derivationPath: DerivationPath.LedgerLive,
          name: 'ledger live',
        },
      ]);
    });

    describe('with seedless wallets', () => {
      beforeEach(() => {
        mockSeedlessWallet();
      });

      it('refreshes session', async () => {
        const refreshSession = jest.fn();

        jest
          .mocked(SeedlessSessionManager)
          .mockReturnValue({ refreshSession } as any);

        await walletService.onUnlock();

        expect(refreshSession).toHaveBeenCalled();
      });
    });

    it('throws when storage contains malformed data', async () => {
      secretsService.getPrimaryWalletsDetails.mockResolvedValueOnce([
        {
          secretType: 'unknown lol',
        },
      ] as any);

      await expect(walletService.onUnlock()).rejects.toThrow(
        'Wallet initialization failed, no key found',
      );
    });
  });

  describe('init', () => {
    it('stores the data and invokes onUnlock', async () => {
      const onUnlockSpy = jest.spyOn(walletService as any, 'onUnlock');
      (getDerivationPath as jest.Mock).mockReturnValueOnce(
        DerivationPath.BIP44,
      );

      await walletService.init({
        mnemonic,
        extendedPublicKeys,
        publicKeys: [],
        derivationPathSpec: DerivationPath.BIP44,
        secretType: SecretType.Mnemonic,
      });

      expect(secretsService.addSecrets).toHaveBeenCalledWith(
        expect.objectContaining({
          mnemonic,
          secretType: SecretType.Mnemonic,
          extendedPublicKeys,
          publicKeys: [],
          derivationPathSpec: DerivationPath.BIP44,
        }),
      );
      expect(onUnlockSpy).toHaveBeenCalled();
    });
  });

  describe('addPrimaryWallet()', () => {
    describe('#validateSecretsType()', () => {
      it('should throw `mnemonic` error', () => {
        const params = {
          secretType: SecretType.Mnemonic,
        } as AddPrimaryWalletSecrets;

        (getDerivationPath as jest.Mock).mockReturnValueOnce(
          DerivationPath.BIP44,
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          }),
        ).rejects.toThrow(
          'Mnemonic or xpub or pubKey is required to create a new wallet!',
        );
      });
      it('should throw `ledger live` error', () => {
        const params = {
          secretType: SecretType.LedgerLive,
        } as AddPrimaryWalletSecrets;

        (getDerivationPath as jest.Mock).mockReturnValueOnce(
          DerivationPath.BIP44,
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          }),
        ).rejects.toThrow('PubKey is required to create a new wallet!');
      });
      it('should throw generic error', () => {
        const params = {
          secretType: SecretType.Keystone,
        } as AddPrimaryWalletSecrets;

        (getDerivationPath as jest.Mock).mockReturnValueOnce(
          DerivationPath.BIP44,
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          }),
        ).rejects.toThrow(
          'Mnemonic or xpub or pubKey is required to create a new wallet!',
        );
      });
    });
    it('should save the new wallet values', async () => {
      const params = {
        mnemonic: 'mnemonic',
        extendedPublicKeys,
        publicKeys: [],
        derivationPathSpec: DerivationPath.BIP44,
        secretType: SecretType.Mnemonic,
      } as AddPrimaryWalletSecrets;
      (getDerivationPath as jest.Mock).mockReturnValueOnce(
        DerivationPath.BIP44,
      );
      await walletService.addPrimaryWallet({
        ...params,
      });
      expect(secretsService.addSecrets).toHaveBeenCalledWith(
        expect.objectContaining(params),
      );
    });
  });

  describe('sign', () => {
    const txMock = {
      to: '0x1',
      from: '0x1',
    };
    const btcTxMock = {
      inputs: [],
      outputs: [],
    };

    const networkMock = {
      chainId: 111,
    } as Network;

    const tabId = 951;

    const spyOnGetWallet = () => jest.spyOn(walletService as any, 'getWallet');

    it('throws if wallet is missing', async () => {
      spyOnGetWallet().mockResolvedValueOnce(undefined);

      await expect(
        walletService.sign(txMock, networkMock, tabId),
      ).rejects.toThrow('Wallet not found');
    });

    it('throws if there is no wallet for btc tx', async () => {
      spyOnGetWallet().mockResolvedValueOnce(walletMock);

      await expect(
        walletService.sign(btcTxMock, networkMock, tabId),
      ).rejects.toThrow('Signing error, wrong network');
    });

    it('throws if there is no wallet for evm tx', async () => {
      spyOnGetWallet().mockResolvedValueOnce(btcWalletMock);

      await expect(
        walletService.sign(txMock, networkMock, tabId),
      ).rejects.toThrow('Signing error, wrong network');
    });

    it('signs btc tx correctly using BitcoinWallet', async () => {
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      spyOnGetWallet().mockResolvedValueOnce(btcWalletMock);

      const { signedTx } = await walletService.sign(
        btcTxMock,
        networkMock,
        tabId,
      );
      expect(btcWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs,
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs BTC transactions correctly using BitcoinKeystoneWallet', async () => {
      const bitcoinProviderMock = new BitcoinProvider(false);
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcKeystoneWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      spyOnGetWallet().mockResolvedValueOnce(btcKeystoneWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        bitcoinProviderMock,
      );
      const { signedTx } = await walletService.sign(
        btcTxMock,
        networkMock,
        tabId,
      );
      expect(btcKeystoneWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs,
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs btc tx correctly using BitcoinLedgerWallet', async () => {
      const bitcoinProviderMock = new BitcoinProvider(false);
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcLedgerWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      spyOnGetWallet().mockResolvedValueOnce(btcLedgerWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        bitcoinProviderMock,
      );
      (prepareBtcTxForLedger as jest.Mock).mockReturnValueOnce(btcTxMock);

      const { signedTx } = await walletService.sign(
        btcTxMock,
        networkMock,
        tabId,
      );
      expect(prepareBtcTxForLedger).toHaveBeenCalledWith(
        btcTxMock,
        bitcoinProviderMock,
      );
      expect(btcLedgerWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs,
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs evm tx correctly using Wallet', async () => {
      walletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      spyOnGetWallet().mockResolvedValueOnce(walletMock);

      const { signedTx } = await walletService.sign(txMock, networkMock, tabId);

      expect(walletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(signedTx).toBe('0x1');
    });

    it('signs evm tx correctly using KeystoneWallet', async () => {
      keystoneWalletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      spyOnGetWallet().mockResolvedValueOnce(keystoneWalletMock);

      const { signedTx } = await walletService.sign(txMock, networkMock, tabId);

      expect(keystoneWalletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(signedTx).toBe('0x1');
    });

    it('signs evm tx correctly using SeedlessWallet', async () => {
      seedlessWalletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      spyOnGetWallet().mockResolvedValueOnce(seedlessWalletMock);

      const { signedTx } = await walletService.sign(txMock, networkMock, tabId);

      expect(seedlessWalletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(signedTx).toBe('0x1');
    });

    it('sign hvm tx correctly', async () => {
      hvmWalletMock.signEd25519 = jest.fn().mockReturnValueOnce('0x1');
      spyOnGetWallet().mockResolvedValueOnce(hvmWalletMock);

      const { signedTx } = await walletService.sign(
        {
          txPayload: { ...txMock } as unknown as TransactionPayload,
          abi: {} as VMABI,
        },
        networkMock,
        tabId,
      );

      expect(hvmWalletMock.signEd25519).toHaveBeenCalledWith({ ...txMock }, {});
      expect(signedTx).toBe('0x1');
    });

    describe('avalanche signing - XP / Coreth', () => {
      const unsignedTxJSON = {
        codecId: '0',
        vm: 'EVM',
        txBytes:
          '0x000000000001000000057fc93d85c6d62c5b2ac0b519c87010ea5294012d1e407030d6acd0021cac10d50000000000000000000000000000000000000000000000000000000000000000000000015f658a6d1928c39b286b48192fea8d46d87ad0770000000005fa29ae3d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa000000000000019a000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa000000070000000005f5e10000000000000000000000000100000001e0cfe8cae22827d032805ded484e393ce51cbedb',
        utxos: [],
        addressMaps: [[['0x5f658a6d1928c39b286b48192fea8d46d87ad077', 0]]],
        credentials: [
          [
            '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          ],
        ],
      };

      let unsignedTxMock, avalancheTxMock;

      beforeEach(() => {
        unsignedTxMock = UnsignedTx.fromJSON(JSON.stringify(unsignedTxJSON));

        avalancheTxMock = {
          tx: unsignedTxMock,
        } as AvalancheTransactionRequest;
      });

      describe('with multiple address indices', () => {
        const mockedPublicKeys: AddressPublicKeyJson[] = [
          {
            curve: 'secp256k1',
            derivationPath: "m/44'/9000'/0'/0/0",
            type: 'address-pubkey',
            key: '0x0000',
          },
          {
            curve: 'secp256k1',
            derivationPath: "m/44'/9000'/0'/0/1",
            type: 'address-pubkey',
            key: '0x0001',
          },
          {
            curve: 'secp256k1',
            derivationPath: "m/44'/9000'/1'/0/0",
            type: 'address-pubkey',
            key: '0x0101',
          },
        ];

        it('builds the SeedlessWallet correctly', async () => {
          mockSeedlessWallet({
            publicKeys: mockedPublicKeys,
          });

          jest
            .spyOn(addressResolver, 'getDerivationPathsByVM')
            .mockResolvedValueOnce({
              [NetworkVMType.PVM]: "m/44'/9000'/0'/0/0",
              [NetworkVMType.AVM]: "m/44'/9000'/0'/0/0",
            })
            .mockResolvedValueOnce({
              [NetworkVMType.PVM]: "m/44'/9000'/0'/0/1",
              [NetworkVMType.AVM]: "m/44'/9000'/0'/0/1",
            });

          jest
            .spyOn(SeedlessWallet.prototype, 'signAvalancheTx')
            .mockResolvedValueOnce(unsignedTxMock);

          await walletService.sign(
            {
              ...avalancheTxMock,
              externalIndices: [0, 1],
            },
            {
              ...networkMock,
              vmName: NetworkVMType.PVM,
            },
          );

          expect(SeedlessWallet).toHaveBeenCalledWith(
            expect.objectContaining({
              addressPublicKeys: expect.arrayContaining([
                mockedPublicKeys[0],
                mockedPublicKeys[1],
              ]),
            }),
          );
        });
      });

      it('throws on wrong wallet type', async () => {
        spyOnGetWallet().mockResolvedValueOnce(btcWalletMock);

        await expect(
          walletService.sign(avalancheTxMock, networkMock, tabId),
        ).rejects.toThrow('Signing error, wrong network');
      });

      it('signs transaction correctly using StaticSigner', async () => {
        staticSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(staticSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(staticSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
          },
          undefined,
        );
      });

      it('signs transaction correctly using SimpleSigner', async () => {
        avalancheTxMock.externalIndices = [1, 2];
        avalancheTxMock.internalIndices = [3, 4];
        simpleSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(simpleSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(simpleSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            externalIndices: avalancheTxMock.externalIndices,
            internalIndices: avalancheTxMock.internalIndices,
          },
          undefined,
        );
      });

      it('signs transaction correctly using LedgerSimpleSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerSimpleSignerMock.signTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(ledgerSimpleSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerSimpleSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            transport: transportMock,
          },
          undefined,
        );
      });

      it('signs transaction correctly using LedgerSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(ledgerSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            transport: transportMock,
          },
          undefined,
        );
      });

      it('signs transaction correctly using LedgerLiveSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerLiveSignerMock.signTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(ledgerLiveSignerMock);

        const multiAccTxMock: AvalancheTransactionRequest = {
          ...avalancheTxMock,
          externalIndices: [0, 1],
        };

        const { signedTx } = await walletService.sign(
          multiAccTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerLiveSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            transport: transportMock,
            externalIndices: multiAccTxMock.externalIndices,
          },
          undefined,
        );
      });

      it('signs transaction correctly using SeedlessWallet', async () => {
        seedlessWalletMock.signAvalancheTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        spyOnGetWallet().mockResolvedValueOnce(seedlessWalletMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          networkMock,
          tabId,
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(seedlessWalletMock.signAvalancheTx).toHaveBeenCalledWith({
          tx: unsignedTxMock,
        });
      });
    });
  });

  describe('signTransactionBatch', () => {
    let getWalletSpy: jest.SpyInstance;
    const txMock = {
      to: '0x1',
      from: '0x1',
      value: '0x1',
    };

    const networkMock = {
      chainId: 111,
    } as Network;

    const tabId = 951;

    beforeEach(() => {
      getWalletSpy = jest.spyOn(walletService as any, 'getWallet');
    });

    it('throws if wallet is missing', async () => {
      getWalletSpy.mockResolvedValueOnce(undefined);

      await expect(
        walletService.sign(txMock, networkMock, tabId),
      ).rejects.toThrow('Wallet not found');
    });

    it.each([
      ['WalletConnect wallets', Object.create(WalletConnectSigner.prototype)],
      ['Ledger wallets', Object.create(LedgerSigner.prototype)],
      ['Keystone wallets', Object.create(KeystoneWallet.prototype)],
    ])('throws for %s', async (_, wallet) => {
      getWalletSpy.mockResolvedValueOnce(wallet);
      jest.spyOn(wallet, 'signTransaction');

      const batch = [
        { from: '0x1', to: '0x2', value: 10n },
        { from: '0x1', to: '0xA', value: 10n },
      ];

      await expect(
        walletService.signTransactionBatch(batch, networkMock, tabId),
      ).rejects.toThrow(
        'The active wallet does not support batch transactions',
      );

      expect(wallet.signTransaction).not.toHaveBeenCalled();
    });

    it.each([
      ['Seedless wallets', Object.create(SeedlessWallet.prototype)],
      ['Mnemonic wallets', Object.create(HDNodeWallet.prototype)],
      ['Private Keys', Object.create(Wallet.prototype)],
    ])('works with %s', async (_, wallet) => {
      getWalletSpy.mockResolvedValueOnce(wallet);
      jest
        .spyOn(wallet, 'signTransaction')
        .mockResolvedValueOnce('0x1')
        .mockResolvedValueOnce('0x2');

      const batch = [
        { from: '0x1', to: '0x2', value: 10n },
        { from: '0x1', to: '0xA', value: 10n },
      ];
      const result = await walletService.signTransactionBatch(
        [
          { from: '0x1', to: '0x2', value: 10n },
          { from: '0x1', to: '0xA', value: 10n },
        ],
        networkMock,
        tabId,
      );

      expect(result).toEqual([{ signedTx: '0x1' }, { signedTx: '0x2' }]);

      expect(wallet.signTransaction).toHaveBeenCalledTimes(2);
      expect(wallet.signTransaction).toHaveBeenNthCalledWith(1, batch[0]);
      expect(wallet.signTransaction).toHaveBeenNthCalledWith(2, batch[1]);
    });
  });

  describe('signMessage', () => {
    const buffer = Buffer;
    const bufferInstance = {
      fill: jest.fn(),
    };
    const activeNetworkMock = {
      chainId: 1,
    } as any;

    const action: Action = {
      request: {
        id: '1',
        method: 'method' as any,
        params: [],
      },
      time: 123,
      status: ActionStatus.SUBMITTING,
      displayData: { messageParams: { data: {} } },
      actionId: 'action ID',
    } as any;

    const undefinedDataAction: Action = {
      ...action,
      displayData: { messageParams: { data: undefined } },
    };

    beforeEach(() => {
      // eslint-disable-next-line no-global-assign
      Buffer = {
        from: jest.fn().mockImplementation(() => {
          return bufferInstance;
        }),
      } as any;

      const signingKeyMock = jest.fn().mockImplementation(() => {
        return {
          privateKey: privateKeyMock,
        };
      });
      Object.assign(walletMock, { _signingKey: signingKeyMock });
      jest
        .spyOn(networkService, 'getNetwork')
        .mockResolvedValue(activeNetworkMock);
    });
    afterEach(() => {
      // eslint-disable-next-line no-global-assign
      Buffer = buffer;
    });

    it('should call wallet.signMessage when wallet is WalletConnectSigner', async () => {
      walletConnectSignerMock.signMessage = jest
        .fn()
        .mockResolvedValueOnce('result hex');

      jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue(walletConnectSignerMock);

      await walletService.signMessage(MessageType.ETH_SIGN, action);
      expect(walletConnectSignerMock.signMessage).toHaveBeenCalledTimes(1);
    });

    it('delegates to SeedlessWallet when needed', async () => {
      seedlessWalletMock.signMessage = jest
        .fn()
        .mockResolvedValueOnce('result hex');

      jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue(seedlessWalletMock);

      await walletService.signMessage(MessageType.ETH_SIGN, action);
      expect(seedlessWalletMock.signMessage).toHaveBeenCalledTimes(1);
    });

    it('signs messages with Ledger', async () => {
      evmLedgerSignerMock.signMessage = jest
        .fn()
        .mockResolvedValueOnce('0x00001')
        .mockResolvedValueOnce('0x00002');

      jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue(evmLedgerSignerMock);

      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, {
          ...action,
          displayData: { messageParams: { data: 'data' } } as any,
        }),
      ).resolves.toBe('0x00001');
      expect(evmLedgerSignerMock.signMessage).toHaveBeenCalledTimes(1);
      expect(evmLedgerSignerMock.signMessage).toHaveBeenCalledWith('data');

      await expect(
        walletService.signMessage(MessageType.PERSONAL_SIGN, action),
      ).resolves.toBe('0x00002');
      expect(evmLedgerSignerMock.signMessage).toHaveBeenCalledTimes(2);
      expect(evmLedgerSignerMock.signMessage).toHaveBeenNthCalledWith(2, {});
    });

    it('signs typed data with Ledger', async () => {
      evmLedgerSignerMock.signTypedData = jest
        .fn()
        .mockResolvedValue('0x00001');

      jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue(evmLedgerSignerMock);

      await expect(
        walletService.signMessage(MessageType.SIGN_TYPED_DATA_V4, {
          ...action,
          displayData: {
            messageParams: {
              data: {
                domain: { name: 'domain' },
                types: { types: 'types' },
                message: { message: 'message' },
              },
            },
          } as any,
        }),
      ).resolves.toBe('0x00001');
      expect(evmLedgerSignerMock.signTypedData).toHaveBeenCalledTimes(1);
      expect(evmLedgerSignerMock.signTypedData).toHaveBeenCalledWith(
        { name: 'domain' },
        { types: 'types' },
        { message: 'message' },
      );
    });

    it('should call Buffer.fill after signing', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);

      await walletService.signMessage(MessageType.ETH_SIGN, action);
      expect(Buffer.from).toHaveBeenCalledTimes(1);
      expect(Buffer.from).toHaveBeenCalledWith(privateKeyMock, 'hex');
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
    });

    it('should call Buffer.fill before throwing an exception when type is not supported', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);

      try {
        await walletService.signMessage('test' as MessageType, action);
      } catch (_err) {
        expect(Buffer.from).toHaveBeenCalledTimes(1);
        expect(Buffer.from).toHaveBeenCalledWith(privateKeyMock, 'hex');
        expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
        expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      }
    });

    it('should call personalSign when MessageType is ETH_SIGN', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.ETH_SIGN,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.ETH_SIGN,
        {},
        activeNetworkMock.chainId,
      );
      expect(personalSign).toHaveBeenCalledTimes(1);
      expect(personalSign).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should call personalSign when MessageType is PERSONAL_SIGN', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.PERSONAL_SIGN,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.PERSONAL_SIGN,
        {},
        activeNetworkMock.chainId,
      );
      expect(personalSign).toHaveBeenCalledTimes(1);
      expect(personalSign).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should call signTypedData when MessageType is SIGN_TYPED_DATA', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (signTypedData as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.SIGN_TYPED_DATA,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA,
        {},
        activeNetworkMock.chainId,
      );
      expect(signTypedData).toHaveBeenCalledTimes(1);
      expect(signTypedData).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
        version: SignTypedDataVersion.V1,
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should call signTypedData when MessageType is SIGN_TYPED_DATA_V1', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (signTypedData as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.SIGN_TYPED_DATA_V1,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V1,
        {},
        activeNetworkMock.chainId,
      );
      expect(signTypedData).toHaveBeenCalledTimes(1);
      expect(signTypedData).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
        version: SignTypedDataVersion.V1,
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should call signTypedData when MessageType is SIGN_TYPED_DATA_V3', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (signTypedData as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.SIGN_TYPED_DATA_V3,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V3,
        {},
        activeNetworkMock.chainId,
      );
      expect(signTypedData).toHaveBeenCalledTimes(1);
      expect(signTypedData).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
        version: SignTypedDataVersion.V3,
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should call signTypedData when MessageType is SIGN_TYPED_DATA_V4', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (signTypedData as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(
        MessageType.SIGN_TYPED_DATA_V4,
        action,
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V4,
        {},
        activeNetworkMock.chainId,
      );
      expect(signTypedData).toHaveBeenCalledTimes(1);
      expect(signTypedData).toHaveBeenCalledWith({
        privateKey: Buffer.from(privateKeyMock, 'hex'),
        data: {},
        version: SignTypedDataVersion.V4,
      });
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      expect(result).toEqual(mockedHash);
    });

    it('should throw an exception when the message is invalid', async () => {
      const errorMessage = 'message is invalid';
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      (ensureMessageFormatIsValid as jest.Mock).mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, action),
      ).rejects.toThrow(errorMessage);
      expect(Buffer.from).not.toHaveBeenCalled();
    });

    it('should throw an exception when there is no active network', async () => {
      jest.spyOn(networkService, 'getNetwork').mockResolvedValue(undefined);
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, action),
      ).rejects.toThrow('no active network found');
      expect(Buffer.from).not.toHaveBeenCalled();
    });

    it('should throw an exception when MessageType is unknown', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      try {
        await walletService.signMessage('unknown' as MessageType, action);
        fail('should have thrown an exception');
      } catch (error) {
        expect(error).toEqual(new Error('unknown method'));
        expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
        expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      }
    });

    it('should throw an exception when data param is falsy', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      try {
        await walletService.signMessage(
          MessageType.ETH_SIGN,
          undefinedDataAction,
        );
        fail('should have thrown an exception');
      } catch (error) {
        expect(error).toEqual(new Error('no message to sign'));
        expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
        expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      }
    });

    it('should throw an exception when wallet is not available', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(undefined);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      try {
        await walletService.signMessage(
          MessageType.ETH_SIGN,
          undefinedDataAction,
        );
        fail('should have thrown an exception');
      } catch (error) {
        expect(error).toEqual(new Error('wallet undefined in sign tx'));
        expect(Buffer.from).not.toHaveBeenCalled();
      }
    });

    it('should throw an exception when wallet is not supported', async () => {
      jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue({ NotWallet: 'notWallet' });
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      try {
        await walletService.signMessage(
          MessageType.ETH_SIGN,
          undefinedDataAction,
        );
        fail('should have thrown an exception');
      } catch (error) {
        expect(error).toEqual(
          new Error(`this function is not supported on your wallet`),
        );
        expect(Buffer.from).not.toHaveBeenCalled();
      }
    });

    it('should use the accountIndex to getWallet if available', async () => {
      const actionWithAccountIndex: Action = {
        request: {
          id: '1',
          params: [],
          method: 'method' as any,
        },
        time: 123,
        status: ActionStatus.SUBMITTING,
        displayData: { messageParams: { data: 'test', accountIndex: 1 } },
        actionId: 'action ID',
      } as any;
      const getWalletSpy = jest
        .spyOn(walletService as any, 'getWallet')
        .mockReturnValue(simpleSignerMock);
      jest
        .mocked(networkService)
        .getAvalancheNetworkXP.mockReturnValue(
          decorateWithCaipId(AVALANCHE_XP_TEST_NETWORK),
        );

      const mockedHash = 'mockedHash';
      simpleSignerMock.signMessage = jest
        .fn()
        .mockResolvedValueOnce(mockedHash);

      const result = await walletService.signMessage(
        MessageType.AVALANCHE_SIGN,
        actionWithAccountIndex,
      );

      expect(getWalletSpy).toHaveBeenCalledTimes(2);
      expect(getWalletSpy).toHaveBeenNthCalledWith(1, {
        accountIndex: 1,
        network: { chainId: 1 },
      });
      expect(getWalletSpy).toHaveBeenNthCalledWith(2, {
        network: AVALANCHE_XP_TEST_NETWORK,
        accountIndex: 1,
      });
      expect(result).toEqual(mockedHash);
    });
  });

  describe('getActiveAccountPublicKey', () => {
    const evmPub = 'evmPub';
    const xpPub = 'xpPub';

    describe('primary accounts', () => {
      it('throws if secrets are missing', async () => {
        secretsService.getAccountSecrets.mockRejectedValue(
          new Error('Wallet is not initialized'),
        );
        await expect(walletService.getActiveAccountPublicKey()).rejects.toThrow(
          'Wallet is not initialized',
        );
      });

      it('throws if pubKeys for the account are missing', async () => {
        mockLedgerLiveWallet({}, { index: 1 });

        await expectToThrowErrorCode(
          walletService.getActiveAccountPublicKey(),
          SecretsError.PublicKeyNotFound,
        );
      });

      it('returns the public keys for mnemonic wallets', async () => {
        const { publicKeys } = mockMnemonicWallet(
          {
            publicKeys: [
              {
                curve: 'secp256k1',
                key: 'evm',
                derivationPath: `m/44'/60'/0'/0/0`,
              },
              {
                curve: 'secp256k1',
                key: 'xp',
                derivationPath: `m/44'/9000'/0'/0/0`,
              },
              {
                curve: 'ed25519',
                key: 'hvm',
                derivationPath: `m/44'/9000'/0'/0/0`,
              },
            ],
          },
          { index: 0 },
        );

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: publicKeys[0]!.key,
          xp: publicKeys[1]!.key,
          ed25519: publicKeys[2]!.key,
        });
      });

      it('returns the public keys based on the extended public key correctly', async () => {
        mockLedgerWallet(
          {
            extendedPublicKeys,
          },
          { index: 0 },
        );

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: 'evm',
          xp: 'xp',
        });
      });

      it('returns the public keys based from the storage', async () => {
        mockLedgerLiveWallet(
          {
            publicKeys: [
              {
                key: evmPub,
                curve: 'secp256k1',
                derivationPath: getAddressDerivationPath(0, 'EVM', {
                  pathSpec: DerivationPath.LedgerLive,
                }),
              },
              {
                key: xpPub,
                curve: 'secp256k1',
                derivationPath: getAddressDerivationPath(0, 'AVM', {
                  pathSpec: DerivationPath.LedgerLive,
                }),
              },
            ],
          },
          { index: 0 },
        );

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });
      });

      it('returns the public keys for seedless wallets', async () => {
        mockSeedlessWallet(
          {
            publicKeys: [
              {
                key: evmPub,
                curve: 'secp256k1',
                derivationPath: getAddressDerivationPath(0, 'EVM', {
                  pathSpec: DerivationPath.BIP44,
                }),
              },
              {
                key: xpPub,
                curve: 'secp256k1',
                derivationPath: getAddressDerivationPath(0, 'AVM', {
                  pathSpec: DerivationPath.BIP44,
                }),
              },
            ],
          },
          { index: 0 },
        );

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });
      });
    });

    describe('imported accounts', () => {
      it('throws if secrets for imported account is not found', async () => {
        mockMnemonicWallet(
          { secretType: SecretType.PrivateKey },
          {
            type: AccountType.IMPORTED,
            id: 'unknown',
          },
        );

        await expect(walletService.getActiveAccountPublicKey()).rejects.toThrow(
          'Cannot find public key for the given imported account',
        );
      });

      it('throws if the account has unknown import type', async () => {
        mockMnemonicWallet(
          {
            secretType: 'what-is-this',
            secret: 'secret1',
          },
          {
            type: AccountType.IMPORTED,
            id: 'id1',
          },
        );

        await expectToThrowErrorCode(
          walletService.getActiveAccountPublicKey(),
          SecretsError.PublicKeyNotFound,
        );
      });

      it('returns the public keys correctly for private key imports', async () => {
        mockMnemonicWallet(
          {
            secretType: SecretType.PrivateKey,
            secret: 'secret1',
          },
          {
            type: AccountType.IMPORTED,
            id: 'id1',
          },
        );
        (getPublicKeyFromPrivateKey as jest.Mock).mockReturnValueOnce(evmPub);
        (ed25519.getPublicKey as jest.Mock).mockReturnValue('123123');

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: evmPub,
          ed25519: '313233313233',
        });

        expect(getPublicKeyFromPrivateKey).toHaveBeenCalledWith('secret1');
      });

      it('returns the public keys correctly for WalletConnect imports', async () => {
        const accountId = 'id-wallet-connect';
        mockMnemonicWallet(
          {
            secretType: SecretType.WalletConnect,
            pubKey: {
              evm: evmPub,
              xp: xpPub,
            },
          },
          {
            type: AccountType.WALLET_CONNECT,
            id: accountId,
          },
        );

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });
      });
    });
  });

  describe('parseWalletPolicyDetails', () => {
    const hmacHex = '123654';
    const xpub = '0x1';
    const masterFingerprint = '1234';
    const name = 'policy';
    const walletPolicy = {} as WalletPolicy;

    it('throws if it fails to find policy details', async () => {
      secretsService.getBtcWalletPolicyDetails.mockResolvedValueOnce(undefined);

      await expect(
        walletService['parseWalletPolicyDetails']({} as Account),
      ).rejects.toThrow('Error while parsing wallet policy: missing data.');
    });

    it('returns the correct data for Ledger Live', async () => {
      secretsService.getBtcWalletPolicyDetails.mockResolvedValueOnce({
        accountIndex: 1,
        details: {
          xpub,
          masterFingerprint,
          hmacHex,
          name,
        },
      });

      (createWalletPolicy as jest.Mock).mockReturnValueOnce(walletPolicy);

      await expect(
        walletService['parseWalletPolicyDetails']({} as Account),
      ).resolves.toStrictEqual({
        hmac: Buffer.from(hmacHex, 'hex'),
        policy: walletPolicy,
      });

      expect(createWalletPolicy).toHaveBeenCalledWith(
        masterFingerprint,
        1,
        xpub,
        name,
      );
    });

    it('returns the correct data for BIP44', async () => {
      secretsService.getBtcWalletPolicyDetails.mockResolvedValueOnce({
        accountIndex: 0,
        details: {
          xpub,
          masterFingerprint,
          hmacHex,
          name,
        },
      });

      (createWalletPolicy as jest.Mock).mockReturnValueOnce(walletPolicy);

      await expect(
        walletService['parseWalletPolicyDetails']({} as Account),
      ).resolves.toStrictEqual({
        hmac: Buffer.from(hmacHex, 'hex'),
        policy: walletPolicy,
      });

      expect(createWalletPolicy).toHaveBeenCalledWith(
        masterFingerprint,
        0,
        xpub,
        name,
      );
    });
  });

  describe('getAddressesByIndices', () => {
    const xpubXP = 'xpubXP';

    it('returns an empty array secrets are not found', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce(null);

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'X',
        false,
      );

      expect(result).toStrictEqual([]);
    });

    it.each([SecretType.LedgerLive, SecretType.Seedless])(
      'returns the known public keys for %s wallets',
      async (secretType: SecretType) => {
        secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
          secretType,
          derivationPathSpec:
            secretType === SecretType.LedgerLive
              ? DerivationPath.LedgerLive
              : DerivationPath.BIP44,
          publicKeys: [
            buildAddressPublicKey(
              '11111111',
              getLegacyXPDerivationPath(0, false),
            ),
            buildAddressPublicKey(
              '22222222',
              getLegacyXPDerivationPath(1, false),
            ),
          ],
        } as any);

        getAddressMock.mockReturnValueOnce('P-1').mockReturnValueOnce('P-2');

        const result = await walletService.getAddressesByIndices(
          [0, 1],
          'P',
          false,
        );

        expect(getAddressMock).toHaveBeenCalledTimes(2);
        expect(getAddressMock).toHaveBeenNthCalledWith(
          1,
          Buffer.from(hex.decode('11111111')),
          'P',
        );
        expect(getAddressMock).toHaveBeenNthCalledWith(
          2,
          Buffer.from(hex.decode('22222222')),
          'P',
        );

        expect(result).toStrictEqual(['P-1', 'P-2']);
      },
    );

    it('returns an empty array if isChange is true for P chain', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        xpubXP,
      } as any);

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'P',
        true,
      );

      expect(result).toStrictEqual([]);
    });

    it('uses the extended public key if available', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        derivationPathSpec: DerivationPath.BIP44,
        extendedPublicKeys: [
          buildExtendedPublicKey('xpubXP', AVALANCHE_BASE_DERIVATION_PATH),
        ],
      } as any);

      (Avalanche.getAddressFromXpub as jest.Mock)
        .mockReturnValueOnce('0x1')
        .mockReturnValueOnce('0x4');

      const result = await walletService.getAddressesByIndices(
        [1, 4],
        'X',
        false,
      );

      expect(result).toStrictEqual(['0x1', '0x4']);
      expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(2);
      expect(Avalanche.getAddressFromXpub).toHaveBeenNthCalledWith(
        1,
        xpubXP,
        1,
        getDefaultFujiProviderMock(),
        'X',
        false,
      );
      expect(Avalanche.getAddressFromXpub).toHaveBeenNthCalledWith(
        2,
        xpubXP,
        4,
        getDefaultFujiProviderMock(),
        'X',
        false,
      );
    });
  });
});
