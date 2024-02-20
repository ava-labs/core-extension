import { BaseWallet, SigningKey } from 'ethers';

import { WalletService } from './WalletService';
import { MessageType } from './../messages/models';
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
  WalletEvents,
  WalletType,
} from './models';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import {
  BitcoinLedgerWallet,
  BitcoinWallet,
  BlockCypherProvider,
  DerivationPath,
  getPubKeyFromTransport,
  getAddressFromXPub,
  getBech32AddressFromXPub,
  getEvmAddressFromPubKey,
  getBtcAddressFromPubKey,
  getPublicKeyFromPrivateKey,
  getAddressPublicKeyFromXPub,
  Avalanche,
  createWalletPolicy,
} from '@avalabs/wallets-sdk';
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
import { Action, ActionStatus } from '../actions/models';
import { UnsignedTx } from '@avalabs/avalanchejs-v2';
import { FireblocksService } from '../fireblocks/FireblocksService';
import { SecretsService } from '../secrets/SecretsService';
import { Account, AccountType, ImportType } from '../accounts/models';
import { SecretType } from '../secrets/models';
import { networks, Transaction } from 'bitcoinjs-lib';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import { SeedlessSessionManager } from '../seedless/SeedlessSessionManager';

jest.mock('../network/NetworkService');
jest.mock('../secrets/SecretsService');
jest.mock('../ledger/LedgerService');
jest.mock('../keystone/KeystoneService');
jest.mock('../lock/LockService');
jest.mock('./utils/prepareBtcTxForLedger');
jest.mock('./utils/ensureMessageFormatIsValid');
jest.mock('@avalabs/wallets-sdk');
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
  let secretsService: jest.Mocked<SecretsService>;

  const privateKeyMock =
    '4ae3e293d0161fa90bfbf51028ceb1e51fe70bc6167afe4e0fe0927d86555503';
  const walletMock = new BaseWallet(new SigningKey('0x' + privateKeyMock));
  const btcWalletMock = Object.create(BitcoinWallet.prototype);
  const btcLedgerWalletMock = Object.create(BitcoinLedgerWallet.prototype);
  const btcKeystoneWalletMock = Object.create(BitcoinKeystoneWallet.prototype);
  const staticSignerMock = Object.create(Avalanche.StaticSigner.prototype);
  const simpleSignerMock = Object.create(Avalanche.SimpleSigner.prototype);
  const ledgerSignerMock = Object.create(Avalanche.LedgerSigner.prototype);
  const ledgerSimpleSignerMock = Object.create(
    Avalanche.SimpleLedgerSigner.prototype
  );
  const keystoneWalletMock = Object.create(KeystoneWallet.prototype);
  const walletConnectSignerMock = Object.create(WalletConnectSigner.prototype);
  const seedlessWalletMock = Object.create(SeedlessWallet.prototype);
  const mnemonic = 'mnemonic';

  let getDefaultFujiProviderMock: jest.Mock;
  let getAddressMock: jest.Mock;

  const WALLET_ID = 'wallet-id';

  const mockMnemonicWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    const data = {
      secretType: SecretType.Mnemonic,
      mnemonic: 'mnemonic',
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      walletId: WALLET_ID,
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getActiveAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);

    return data;
  };

  const mockLedgerWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    const data = {
      secretType: SecretType.Ledger,
      xpub: 'xpub',
      xpubXP: 'xpubXP',
      derivationPath: DerivationPath.BIP44,
      walletId: WALLET_ID,
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getActiveAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);

    return data;
  };

  const mockLedgerLiveWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    const data = {
      secretType: SecretType.LedgerLive,
      derivationPath: DerivationPath.LedgerLive,
      pubKeys: [{ evm: 'evm', xp: 'xp' }],
      walletId: WALLET_ID,
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getActiveAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);

    return data;
  };

  const mockSeedlessWallet = (
    additionalData = {},
    account?: Partial<Account>
  ) => {
    const data = {
      secretType: SecretType.Seedless,
      derivationPath: DerivationPath.BIP44,
      pubKeys: [{ evm: 'evm', xp: 'xp' }],
      walletId: WALLET_ID,
      ...additionalData,
      account: {
        type: AccountType.PRIMARY,
        ...account,
      },
    };
    secretsService.getPrimaryAccountSecrets.mockResolvedValue(data as any);
    secretsService.getActiveAccountSecrets.mockResolvedValue(data as any);
    secretsService.getWalletAccountsSecretsById.mockResolvedValue(data as any);

    return data;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    networkService = new NetworkService({} as any);
    ledgerService = new LedgerService();
    keystoneService = new KeystoneService();
    walletConnectService = new WalletConnectService(
      new WalletConnectStorage({} as any)
    );
    fireblocksService = new FireblocksService({} as any);

    secretsService = jest.mocked(new SecretsService({} as any));

    getAddressMock = jest.fn().mockImplementation((pubkey, chain) => {
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
      secretsService
    );

    (networkService.getAvalanceProviderXP as jest.Mock).mockReturnValue(
      Avalanche.JsonRpcProvider.getDefaultFujiProvider()
    );
  });

  describe('onLock', () => {
    it('clears the wallet details and triggers an event', async () => {
      mockMnemonicWallet();

      await walletService.onUnlock();
      expect(walletService.walletDetails).toEqual({
        type: WalletType.MNEMONIC,
        derivationPath: DerivationPath.BIP44,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      walletService.onLock();

      expect(walletService.walletDetails).toBeUndefined();
      expect(eventListener).toHaveBeenCalledWith(undefined);
    });

    it('clears the wallet details and triggers an event for Ledger wallets', async () => {
      mockLedgerWallet();

      await walletService.onUnlock();
      expect(walletService.walletDetails).toEqual({
        type: WalletType.LEDGER,
        derivationPath: DerivationPath.BIP44,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      walletService.onLock();
      expect(walletService.walletDetails).toBeUndefined();
      expect(eventListener).toHaveBeenCalledWith(undefined);
    });
  });

  describe('onUnlock', () => {
    it('returns early if storage is empty', async () => {
      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletDetails).toBeUndefined();
    });

    it('sets the walletType as mnemonic', async () => {
      mockMnemonicWallet();
      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletDetails).toEqual({
        type: WalletType.MNEMONIC,
        derivationPath: DerivationPath.BIP44,
      });
      expect(eventListener).toHaveBeenCalledWith({
        type: WalletType.MNEMONIC,
        derivationPath: DerivationPath.BIP44,
      });
    });

    it('sets the walletType as ledger if xpub is present', async () => {
      mockLedgerWallet();

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletDetails).toEqual({
        type: WalletType.LEDGER,
        derivationPath: DerivationPath.BIP44,
      });
      expect(eventListener).toHaveBeenCalledWith({
        type: WalletType.LEDGER,
        derivationPath: DerivationPath.BIP44,
      });
    });

    it('sets the walletType as ledger if pubKeys is present', async () => {
      mockLedgerLiveWallet();

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletDetails).toEqual({
        type: WalletType.LEDGER,
        derivationPath: DerivationPath.LedgerLive,
      });
      expect(eventListener).toHaveBeenCalledWith({
        type: WalletType.LEDGER,
        derivationPath: DerivationPath.LedgerLive,
      });
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
      mockMnemonicWallet({
        secretType: 'unknown lol',
      });

      await expect(walletService.onUnlock()).rejects.toThrowError(
        'Wallet initialization failed, no key found'
      );
      expect(walletService.walletDetails).toBeUndefined();
    });
  });

  describe('init', () => {
    it('stores the data and invokes onUnlock', async () => {
      const onUnlockSpy = jest.spyOn(walletService as any, 'onUnlock');
      (getDerivationPath as jest.Mock).mockReturnValueOnce(
        DerivationPath.BIP44
      );

      await walletService.init({
        mnemonic,
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        derivationPath: DerivationPath.BIP44,
        secretType: SecretType.Mnemonic,
      });

      expect(secretsService.addSecrets).toHaveBeenCalledWith(
        expect.objectContaining({
          mnemonic,
          secretType: SecretType.Mnemonic,
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          derivationPath: DerivationPath.BIP44,
          name: 'mnemonic 1',
        })
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
          DerivationPath.BIP44
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          })
        ).rejects.toThrowError(
          'Mnemonic or xpub or pubKey is required to create a new wallet!'
        );
      });
      it('should throw `ledger live` error', () => {
        const params = {
          secretType: SecretType.LedgerLive,
        } as AddPrimaryWalletSecrets;

        (getDerivationPath as jest.Mock).mockReturnValueOnce(
          DerivationPath.BIP44
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          })
        ).rejects.toThrowError('PubKey is required to create a new wallet!');
      });
      it('should throw generic error', () => {
        const params = {
          secretType: SecretType.Keystone,
        } as AddPrimaryWalletSecrets;

        (getDerivationPath as jest.Mock).mockReturnValueOnce(
          DerivationPath.BIP44
        );
        expect(
          walletService.addPrimaryWallet({
            ...params,
          })
        ).rejects.toThrowError(
          'Mnemonic or xpub or pubKey is required to create a new wallet!'
        );
      });
    });
    it('should save the new wallet values', async () => {
      const params = {
        mnemonic: 'mnemonic',
        xpub: 'xpub',
        xpubXP: 'xpubXP',
        derivationPath: DerivationPath.BIP44,
        secretType: SecretType.Mnemonic,
      } as AddPrimaryWalletSecrets;
      (getDerivationPath as jest.Mock).mockReturnValueOnce(
        DerivationPath.BIP44
      );
      await walletService.addPrimaryWallet({
        ...params,
      });
      expect(secretsService.addSecrets).toHaveBeenCalledWith(
        expect.objectContaining(params)
      );
    });
  });

  describe('sign', () => {
    let getWalletSpy: jest.SpyInstance;

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

    beforeEach(() => {
      getWalletSpy = jest.spyOn(walletService as any, 'getWallet');
    });

    it('throws if wallet is missing', async () => {
      getWalletSpy.mockResolvedValueOnce(undefined);

      await expect(
        walletService.sign(txMock, tabId, networkMock)
      ).rejects.toThrowError('Wallet not found');
    });

    it('throws if there is no wallet for btc tx', async () => {
      getWalletSpy.mockResolvedValueOnce(walletMock);

      await expect(
        walletService.sign(btcTxMock, tabId, networkMock)
      ).rejects.toThrowError('Signing error, wrong network');
    });

    it('throws if there is no wallet for evm tx', async () => {
      getWalletSpy.mockResolvedValueOnce(btcWalletMock);

      await expect(
        walletService.sign(txMock, tabId, networkMock)
      ).rejects.toThrowError('Signing error, wrong network');
    });

    it('signs btc tx correctly using BitcoinWallet', async () => {
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      getWalletSpy.mockResolvedValueOnce(btcWalletMock);

      const { signedTx } = await walletService.sign(
        btcTxMock,
        tabId,
        networkMock
      );
      expect(btcWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs BTC transactions correctly using BitcoinKeystoneWallet', async () => {
      const blockCypherProviderMock = new BlockCypherProvider(false);
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcKeystoneWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      getWalletSpy.mockResolvedValueOnce(btcKeystoneWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        blockCypherProviderMock
      );
      const { signedTx } = await walletService.sign(
        btcTxMock,
        tabId,
        networkMock
      );
      expect(btcKeystoneWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs btc tx correctly using BitcoinLedgerWallet', async () => {
      const blockCypherProviderMock = new BlockCypherProvider(false);
      const buffer = Buffer.from('0x1');
      const tx = new Transaction();
      tx.toHex = jest.fn().mockReturnValue(buffer.toString('hex'));
      btcLedgerWalletMock.signTx = jest.fn().mockResolvedValueOnce(tx);
      getWalletSpy.mockResolvedValueOnce(btcLedgerWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        blockCypherProviderMock
      );
      (prepareBtcTxForLedger as jest.Mock).mockReturnValueOnce(btcTxMock);

      const { signedTx } = await walletService.sign(
        btcTxMock,
        tabId,
        networkMock
      );
      expect(prepareBtcTxForLedger).toHaveBeenCalledWith(
        btcTxMock,
        blockCypherProviderMock
      );
      expect(btcLedgerWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(signedTx).toBe(buffer.toString('hex'));
    });

    it('signs evm tx correctly using Wallet', async () => {
      walletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      getWalletSpy.mockResolvedValueOnce(walletMock);

      const { signedTx } = await walletService.sign(txMock, tabId, networkMock);

      expect(walletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(signedTx).toBe('0x1');
    });

    it('signs evm tx correctly using KeystoneWallet', async () => {
      keystoneWalletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      getWalletSpy.mockResolvedValueOnce(keystoneWalletMock);

      const { signedTx } = await walletService.sign(txMock, tabId, networkMock);

      expect(keystoneWalletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(signedTx).toBe('0x1');
    });

    it('signs evm tx correctly using SeedlessWallet', async () => {
      seedlessWalletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      getWalletSpy.mockResolvedValueOnce(seedlessWalletMock);

      const { signedTx } = await walletService.sign(txMock, tabId, networkMock);

      expect(seedlessWalletMock.signTransaction).toHaveBeenCalledWith(txMock);
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

      it('throws on wrong wallet type', async () => {
        getWalletSpy.mockResolvedValueOnce(btcWalletMock);

        await expect(
          walletService.sign(avalancheTxMock, tabId, networkMock)
        ).rejects.toThrowError('Signing error, wrong network');
      });

      it('signs transaction correctly using StaticSigner', async () => {
        staticSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(staticSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(staticSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
          },
          undefined
        );
      });

      it('signs transaction correctly using SimpleSigner', async () => {
        avalancheTxMock.externalIndices = [1, 2];
        avalancheTxMock.internalIndices = [3, 4];
        simpleSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(simpleSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(simpleSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            externalIndices: avalancheTxMock.externalIndices,
            internalIndices: avalancheTxMock.internalIndices,
          },
          undefined
        );
      });

      it('signs transaction correctly using LedgerSimpleSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerSimpleSignerMock.signTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(ledgerSimpleSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerSimpleSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            transport: transportMock,
          },
          undefined
        );
      });

      it('signs transaction correctly using LedgerSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(ledgerSignerMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerSignerMock.signTx).toHaveBeenCalledWith(
          {
            tx: unsignedTxMock,
            transport: transportMock,
          },
          undefined
        );
      });

      it('signs transaction correctly using SeedlessWallet', async () => {
        seedlessWalletMock.signAvalancheTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(seedlessWalletMock);

        const { signedTx } = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(signedTx).toEqual(JSON.stringify(unsignedTxJSON));
        expect(seedlessWalletMock.signAvalancheTx).toHaveBeenCalledWith({
          tx: unsignedTxMock,
        });
      });
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
      time: 123,
      status: ActionStatus.SUBMITTING,
      displayData: { messageParams: { data: {} } },
      method: 'method',
      actionId: 'action ID',
    };

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
      (networkService.activeNetwork as any) = activeNetworkMock;
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
      } catch (error) {
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.ETH_SIGN,
        {},
        activeNetworkMock.chainId
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.PERSONAL_SIGN,
        {},
        activeNetworkMock.chainId
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA,
        {},
        activeNetworkMock.chainId
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V1,
        {},
        activeNetworkMock.chainId
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V3,
        {},
        activeNetworkMock.chainId
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
        action
      );
      expect(ensureMessageFormatIsValid).toHaveBeenCalledWith(
        MessageType.SIGN_TYPED_DATA_V4,
        {},
        activeNetworkMock.chainId
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
        walletService.signMessage(MessageType.ETH_SIGN, action)
      ).rejects.toThrow(errorMessage);
      expect(Buffer.from).not.toHaveBeenCalled();
    });

    it('should throw an exception when there is no active network', async () => {
      (networkService.activeNetwork as any) = undefined;
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, action)
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
          undefinedDataAction
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
          undefinedDataAction
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
          undefinedDataAction
        );
        fail('should have thrown an exception');
      } catch (error) {
        expect(error).toEqual(
          new Error(`this function not supported on your wallet`)
        );
        expect(Buffer.from).not.toHaveBeenCalled();
      }
    });
  });

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
      expect(getAddressesSpy).toHaveBeenCalledWith(1);
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

        await expect(
          walletService.addAddress(1, WALLET_ID)
        ).rejects.toThrowError('Ledger transport not available');
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

        await expect(
          walletService.addAddress(1, WALLET_ID)
        ).rejects.toThrowError('Failed to get public key from device.');
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

        await expect(
          walletService.addAddress(1, WALLET_ID)
        ).rejects.toThrowError('Failed to get public key from device.');
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
        expect(getAddressesSpy).toHaveBeenCalledWith(0);
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
        expect(getAddressesSpy).toHaveBeenCalledWith(0);
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
          expect(getAddressesSpy).toHaveBeenCalledWith(1);
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

          expect(getAddressesSpy).toHaveBeenCalledWith(1);
          expect(result).toStrictEqual(addressesMock);
        });
      });
    });
  });

  describe('getAddresses', () => {
    const addressesMock = (addressC: string, addressBTC: string) => ({
      [NetworkVMType.EVM]: addressC,
      [NetworkVMType.BITCOIN]: addressBTC,
      [NetworkVMType.AVM]: 'X-',
      [NetworkVMType.PVM]: 'P-',
      [NetworkVMType.CoreEth]: 'C-',
    });

    it('throws if storage is empty', async () => {
      mockMnemonicWallet({ secretType: 'unknown' });
      await expect(walletService.getAddresses(0)).rejects.toThrowError(
        'No public key available'
      );
    });

    it('works when active account is imported', async () => {
      mockLedgerWallet(
        {
          imported: {
            fb: {
              type: ImportType.FIREBLOCKS,
              addresses: { addressC: 'addressC' },
            },
          },
        },
        { type: AccountType.FIREBLOCKS, id: 'fb' }
      );

      (getAddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');
      (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x2');
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);
      await expect(walletService.getAddresses(0)).resolves.toStrictEqual(
        addressesMock('0x1', '0x2')
      );
      expect(Avalanche.getAddressPublicKeyFromXpub).toBeCalledWith('xpubXP', 0);
      expect(getAddressFromXPub).toHaveBeenCalledWith('xpub', 0);
      expect(getBech32AddressFromXPub).toHaveBeenCalledWith(
        'xpub',
        0,
        networks.testnet
      );
    });

    it('returns the addresses for xpub', async () => {
      mockLedgerWallet();
      (getAddressFromXPub as jest.Mock).mockReturnValueOnce('0x1');
      (getBech32AddressFromXPub as jest.Mock).mockReturnValueOnce('0x2');
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);
      await expect(walletService.getAddresses(0)).resolves.toStrictEqual(
        addressesMock('0x1', '0x2')
      );
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

      await expect(walletService.getAddresses(0)).rejects.toThrowError(
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

      await expect(walletService.getAddresses(0)).resolves.toStrictEqual(
        addressesMock('0x1', '0x2')
      );

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
      ).rejects.toThrowError('Error while calculating addresses');
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
      ).rejects.toThrowError('Error while calculating addresses');
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
      ).rejects.toThrowError('Error while calculating addresses');
    });
  });

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

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError('No secrets found for imported account');
    });

    it('throws if importType is not supported', async () => {
      secretsService.getImportedAccountSecrets.mockResolvedValue({
        secretType: 'unknown' as any,
        secret: 'secret',
      });

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError('Unsupported import type');
    });

    it('throws if addresses are missing', async () => {
      secretsService.getImportedAccountSecrets.mockResolvedValue({
        secretType: SecretType.PrivateKey,
        secret: 'secret',
      });
      (getEvmAddressFromPubKey as jest.Mock).mockReturnValueOnce('');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValueOnce('');

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError('Missing address');
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

  describe('getActiveAccountPublicKey', () => {
    const evmPub = 'evmPub';
    const xpPub = 'xpPub';

    describe('primary accounts', () => {
      it('throws if secrets are missing', async () => {
        secretsService.getActiveAccountSecrets.mockRejectedValue(
          new Error('Wallet is not initialized')
        );
        await expect(
          walletService.getActiveAccountPublicKey()
        ).rejects.toThrowError('Wallet is not initialized');
      });

      it('throws if pubKeys for the account are missing', async () => {
        mockLedgerLiveWallet({}, { index: 1 });

        await expect(
          walletService.getActiveAccountPublicKey()
        ).rejects.toThrowError('Can not find public key for the given index');
      });

      it('returns the public keys for mnemonic wallets', async () => {
        const { xpub, xpubXP } = mockMnemonicWallet({}, { index: 0 });

        jest
          .mocked(getAddressPublicKeyFromXPub)
          .mockReturnValueOnce(evmPub as any);
        jest
          .mocked(Avalanche.getAddressPublicKeyFromXpub)
          .mockReturnValueOnce(xpPub as any);

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });

        expect(getAddressPublicKeyFromXPub).toHaveBeenCalledWith(xpub, 0);
        expect(Avalanche.getAddressPublicKeyFromXpub).toHaveBeenCalledWith(
          xpubXP,
          0
        );
      });

      it('returns the public keys based on the extended public key correctly', async () => {
        const { xpub, xpubXP } = mockLedgerWallet({}, { index: 0 });

        (getAddressPublicKeyFromXPub as jest.Mock).mockReturnValueOnce(evmPub);
        (
          Avalanche.getAddressPublicKeyFromXpub as jest.Mock
        ).mockReturnValueOnce(xpPub);

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });

        expect(getAddressPublicKeyFromXPub).toHaveBeenCalledWith(xpub, 0);
        expect(Avalanche.getAddressPublicKeyFromXpub).toHaveBeenCalledWith(
          xpubXP,
          0
        );
      });

      it('returns the public keys based from the storage', async () => {
        mockLedgerLiveWallet(
          {
            pubKeys: [
              {
                evm: evmPub,
                xp: xpPub,
              },
            ],
          },
          { index: 0 }
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
            pubKeys: [
              {
                evm: evmPub,
                xp: xpPub,
              },
            ],
          },
          { index: 0 }
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
          }
        );

        await expect(
          walletService.getActiveAccountPublicKey()
        ).rejects.toThrowError(
          'Cannot find public key for the given imported account'
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
          }
        );

        await expect(
          walletService.getActiveAccountPublicKey()
        ).rejects.toThrowError('Unable to get public key');
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
          }
        );
        (getPublicKeyFromPrivateKey as jest.Mock).mockReturnValueOnce(evmPub);

        const result = await walletService.getActiveAccountPublicKey();

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: evmPub,
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
          }
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
        walletService['parseWalletPolicyDetails']()
      ).rejects.toThrowError(
        'Error while parsing wallet policy: missing data.'
      );
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
        walletService['parseWalletPolicyDetails']()
      ).resolves.toStrictEqual({
        hmac: Buffer.from(hmacHex, 'hex'),
        policy: walletPolicy,
      });

      expect(createWalletPolicy).toHaveBeenCalledWith(
        masterFingerprint,
        1,
        xpub,
        name
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
        walletService['parseWalletPolicyDetails']()
      ).resolves.toStrictEqual({
        hmac: Buffer.from(hmacHex, 'hex'),
        policy: walletPolicy,
      });

      expect(createWalletPolicy).toHaveBeenCalledWith(
        masterFingerprint,
        0,
        xpub,
        name
      );
    });
  });

  describe('getAddressesByIndices', () => {
    const xpubXP = 'xpubXP';

    it('returns an empty array if xpub XP is missing from storage', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        mnemonic: 'mnemonic',
        xpubXP: undefined,
      } as any);

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'X',
        false
      );

      expect(result).toStrictEqual([]);
    });

    it('returns an empty array if isChange is true for P chain', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        xpubXP,
      } as any);

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'P',
        true
      );

      expect(result).toStrictEqual([]);
    });

    it('returns the correct list of addresses', async () => {
      secretsService.getPrimaryAccountSecrets.mockResolvedValueOnce({
        xpubXP,
      } as any);

      (Avalanche.getAddressFromXpub as jest.Mock)
        .mockReturnValueOnce('0x1')
        .mockReturnValueOnce('0x4');

      const result = await walletService.getAddressesByIndices(
        [1, 4],
        'X',
        false
      );

      expect(result).toStrictEqual(['0x1', '0x4']);
      expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(2);
      expect(Avalanche.getAddressFromXpub).toHaveBeenNthCalledWith(
        1,
        xpubXP,
        1,
        getDefaultFujiProviderMock(),
        'X',
        false
      );
      expect(Avalanche.getAddressFromXpub).toHaveBeenNthCalledWith(
        2,
        xpubXP,
        4,
        getDefaultFujiProviderMock(),
        'X',
        false
      );
    });
  });
});
