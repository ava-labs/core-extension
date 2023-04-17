import { WalletService } from './WalletService';
import { MessageType } from './../messages/models';
import { StorageService } from '../storage/StorageService';
import { NetworkService } from '../network/NetworkService';
import { LedgerService } from '../ledger/LedgerService';
import { LockService } from '../lock/LockService';
import { Wallet } from '@ethersproject/wallet';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import {
  AvalancheTransactionRequest,
  WalletEvents,
  WalletType,
  WALLET_STORAGE_KEY,
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
  getLedgerExtendedPublicKey,
  createWalletPolicy,
} from '@avalabs/wallets-sdk';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
import { LedgerTransport } from '../ledger/LedgerTransport';
import { networks } from 'bitcoinjs-lib';
import {
  Account,
  AccountType,
  ImportedAccount,
  ImportType,
  PrimaryAccount,
} from '../accounts/models';
import getDerivationPath from './utils/getDerivationPath';
import ensureMessageIsValid from './utils/ensureMessageIsValid';
import { KeystoneService } from '../keystone/KeystoneService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { WalletPolicy } from 'ledger-bitcoin';

jest.mock('../storage/StorageService');
jest.mock('../network/NetworkService');
jest.mock('../ledger/LedgerService');
jest.mock('../keystone/KeystoneService');
jest.mock('../lock/LockService');
jest.mock('./utils/prepareBtcTxForLedger');
jest.mock('./utils/ensureMessageIsValid');
jest.mock('@avalabs/wallets-sdk');
jest.mock('./utils/getDerivationPath');

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
  let storageService: StorageService;
  let networkService: NetworkService;
  let ledgerService: LedgerService;
  let lockService: LockService;
  let keystoneService: KeystoneService;

  const walletMock = Object.create(Wallet.prototype);
  const btcWalletMock = Object.create(BitcoinWallet.prototype);
  const btcLedgerWalletMock = Object.create(BitcoinLedgerWallet.prototype);
  const btcKeystoneWalletMock = Object.create(BitcoinKeystoneWallet.prototype);
  const staticSignerMock = Object.create(Avalanche.StaticSigner.prototype);
  const simpleSignerMock = Object.create(Avalanche.SimpleSigner.prototype);
  const ledgerSimpleSignerMock = Object.create(
    Avalanche.SimpleLedgerSigner.prototype
  );
  const keystoneWalletMock = Object.create(KeystoneWallet.prototype);
  const privateKeyMock = 'privateKey';
  const mnemonic = 'mnemonic';

  let getDefaultFujiProviderMock: jest.Mock;
  let getAddressMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    storageService = new StorageService({} as any);
    networkService = new NetworkService({} as any);
    ledgerService = new LedgerService();
    lockService = new LockService({} as any, {} as any);
    keystoneService = new KeystoneService();

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
      storageService,
      networkService,
      ledgerService,
      lockService,
      keystoneService
    );

    (networkService.getAvalanceProviderXP as jest.Mock).mockReturnValue(
      Avalanche.JsonRpcProvider.getDefaultFujiProvider()
    );
  });

  describe('onLock', () => {
    it('clears the walletType and triggers an event', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        mnemonic,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await walletService.onUnlock();
      expect(walletService.walletType).toBe(WalletType.MNEMONIC);

      walletService.onLock();
      expect(walletService.walletType).toBeUndefined();
      expect(eventListener).toHaveBeenCalledWith({
        walletType: undefined,
        derivationPath: undefined,
      });
    });

    it('clears the walletType and the derivationPath and triggers an event for Ledger wallets', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        xpub: 'xpub',
        derivationPath: DerivationPath.BIP44,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await walletService.onUnlock();
      expect(walletService.walletType).toBe(WalletType.LEDGER);
      expect(walletService.derivationPath).toBe(DerivationPath.BIP44);

      walletService.onLock();
      expect(walletService.walletType).toBeUndefined();
      expect(walletService.derivationPath).toBeUndefined();
      expect(eventListener).toHaveBeenCalledWith({
        walletType: undefined,
        derivationPath: undefined,
      });
    });
  });

  describe('onUnlock', () => {
    it('returns early if storage is empty', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletType).toBeUndefined();
    });

    it('sets the walletType as mnemonic', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        mnemonic,
      });
      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletType).toBe(WalletType.MNEMONIC);
      expect(eventListener).toHaveBeenCalledWith({
        walletType: WalletType.MNEMONIC,
        derivationPath: undefined,
      });
    });

    it('sets the walletType as ledger if xpub is present', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        xpub: 'xpub',
        derivationPath: DerivationPath.LedgerLive,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletType).toBe(WalletType.LEDGER);
      expect(eventListener).toHaveBeenCalledWith({
        walletType: WalletType.LEDGER,
        derivationPath: DerivationPath.LedgerLive,
      });
    });

    it('sets the walletType as ledger if pubKeys is present', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        pubKeys: ['0x1'],
        derivationPath: DerivationPath.BIP44,
      });

      const eventListener = jest.fn();
      walletService.addListener(
        WalletEvents.WALLET_STATE_UPDATE,
        eventListener
      );

      await expect(walletService.onUnlock()).resolves.toBeUndefined();
      expect(walletService.walletType).toBe(WalletType.LEDGER);
      expect(eventListener).toHaveBeenCalledWith({
        walletType: WalletType.LEDGER,
        derivationPath: DerivationPath.BIP44,
      });
    });

    it('throws when storage contains malformed data', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        shouldFail: true,
      });

      await expect(walletService.onUnlock()).rejects.toThrowError(
        'Wallet initialization failed, no key found'
      );
      expect(walletService.walletType).toBeUndefined();
    });
  });

  describe('init', () => {
    it('throws if non of the params were provided', async () => {
      await expect(walletService.init({})).rejects.toThrowError(
        'Mnemonic, pubKeys or xpub is required'
      );
    });

    it('stores the data and invokes onUnlock', async () => {
      const onUnlockSpy = jest.spyOn(walletService as any, 'onUnlock');
      (getDerivationPath as jest.Mock).mockReturnValueOnce(
        DerivationPath.BIP44
      );

      await walletService.init({ mnemonic });

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        mnemonic,
        pubKeys: undefined,
        xpub: undefined,
        xpubXP: undefined,
        derivationPath: DerivationPath.BIP44,
      });
      expect(onUnlockSpy).toHaveBeenCalled();
    });
  });

  describe('getMnemonic', () => {
    it('throws if password is invalid', async () => {
      (lockService.verifyPassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(walletService.getMnemonic('password')).rejects.toThrowError(
        'Password invalid'
      );
    });

    it('throws if storage does not contain mnemonic', async () => {
      (lockService.verifyPassword as jest.Mock).mockResolvedValueOnce(true);

      await expect(walletService.getMnemonic('password')).rejects.toThrowError(
        'Not a MnemonicWallet'
      );
    });

    it('returns the mnemonic properly', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        mnemonic,
      });
      (lockService.verifyPassword as jest.Mock).mockResolvedValueOnce(true);

      await expect(walletService.getMnemonic('password')).resolves.toBe(
        mnemonic
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
      btcWalletMock.signTx = jest.fn().mockResolvedValueOnce({
        toHex: jest.fn(() => buffer.toString('hex')),
      });
      getWalletSpy.mockResolvedValueOnce(btcWalletMock);

      const result = await walletService.sign(btcTxMock, tabId, networkMock);
      expect(btcWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(result).toBe(buffer.toString('hex'));
    });

    it('signs BTC transactions correctly using BitcoinKeystoneWallet', async () => {
      const blockCypherProviderMock = new BlockCypherProvider(false);
      const buffer = Buffer.from('0x1');
      btcKeystoneWalletMock.signTx = jest.fn().mockResolvedValueOnce({
        toHex: jest.fn(() => buffer.toString('hex')),
      });
      getWalletSpy.mockResolvedValueOnce(btcKeystoneWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        blockCypherProviderMock
      );
      const result = await walletService.sign(btcTxMock, tabId, networkMock);
      expect(btcKeystoneWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(result).toBe(buffer.toString('hex'));
    });

    it('signs btc tx correctly using BitcoinLedgerWallet', async () => {
      const blockCypherProviderMock = new BlockCypherProvider(false);
      const buffer = Buffer.from('0x1');
      btcLedgerWalletMock.signTx = jest.fn().mockResolvedValueOnce({
        toHex: jest.fn(() => buffer.toString('hex')),
      });
      getWalletSpy.mockResolvedValueOnce(btcLedgerWalletMock);
      (networkService.getBitcoinProvider as jest.Mock).mockResolvedValueOnce(
        blockCypherProviderMock
      );
      (prepareBtcTxForLedger as jest.Mock).mockReturnValueOnce(btcTxMock);

      const result = await walletService.sign(btcTxMock, tabId, networkMock);
      expect(prepareBtcTxForLedger).toHaveBeenCalledWith(
        btcTxMock,
        blockCypherProviderMock
      );
      expect(btcLedgerWalletMock.signTx).toHaveBeenCalledWith(
        btcTxMock.inputs,
        btcTxMock.outputs
      );
      expect(result).toBe(buffer.toString('hex'));
    });

    it('signs evm tx correctly using Wallet', async () => {
      walletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      getWalletSpy.mockResolvedValueOnce(walletMock);

      const result = await walletService.sign(txMock, tabId, networkMock);

      expect(walletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(result).toBe('0x1');
    });

    it('signs evm tx correctly using KeystoneWallet', async () => {
      keystoneWalletMock.signTransaction = jest.fn().mockReturnValueOnce('0x1');
      getWalletSpy.mockResolvedValueOnce(keystoneWalletMock);

      const result = await walletService.sign(txMock, tabId, networkMock);

      expect(keystoneWalletMock.signTransaction).toHaveBeenCalledWith(txMock);
      expect(result).toBe('0x1');
    });

    describe('avalanche signing - XP / Coreth', () => {
      const unsignedTxJSON = { foo: 'bar' };

      let unsignedTxMock, avalancheTxMock;

      beforeEach(() => {
        unsignedTxMock = {
          toJSON: jest.fn().mockReturnValue(unsignedTxJSON),
          getSignedTx: jest.fn(),
        };

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

        const result = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(result).toEqual(JSON.stringify(unsignedTxJSON));
        expect(staticSignerMock.signTx).toHaveBeenCalledWith({
          tx: unsignedTxMock,
        });
      });

      it('signs transaction correctly using SimpleSigner', async () => {
        avalancheTxMock.externalIndices = [1, 2];
        avalancheTxMock.internalIndices = [3, 4];
        simpleSignerMock.signTx = jest.fn().mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(simpleSignerMock);

        const result = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(result).toEqual(JSON.stringify(unsignedTxJSON));
        expect(simpleSignerMock.signTx).toHaveBeenCalledWith({
          tx: unsignedTxMock,
          externalIndices: avalancheTxMock.externalIndices,
          internalIndices: avalancheTxMock.internalIndices,
        });
      });

      it('signs transaction correctly using LedgerSimpleSigner', async () => {
        const transportMock = {} as LedgerTransport;
        (ledgerService as any).recentTransport = transportMock;
        ledgerSimpleSignerMock.signTx = jest
          .fn()
          .mockReturnValueOnce(unsignedTxMock);
        getWalletSpy.mockResolvedValueOnce(ledgerSimpleSignerMock);

        const result = await walletService.sign(
          avalancheTxMock,
          tabId,
          networkMock
        );

        expect(result).toEqual(JSON.stringify(unsignedTxJSON));
        expect(ledgerSimpleSignerMock.signTx).toHaveBeenCalledWith({
          tx: unsignedTxMock,
          transport: transportMock,
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

    it('should call Buffer.fill after signing', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);

      await walletService.signMessage(MessageType.ETH_SIGN, {});
      expect(Buffer.from).toHaveBeenCalledTimes(1);
      expect(Buffer.from).toHaveBeenCalledWith(walletMock.privateKey, 'hex');
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
    });

    it('should call Buffer.fill before throwing an exception when type is not supported', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);

      try {
        await walletService.signMessage('test' as MessageType, {});
      } catch (error) {
        expect(Buffer.from).toHaveBeenCalledTimes(1);
        expect(Buffer.from).toHaveBeenCalledWith(walletMock.privateKey, 'hex');
        expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
        expect(bufferInstance.fill).toHaveBeenCalledWith(0);
      }
    });

    it('should call personalSign when MessageType is ETH_SIGN', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      const result = await walletService.signMessage(MessageType.ETH_SIGN, {});
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
        {}
      );
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
        {}
      );
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
        {}
      );
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
        {}
      );
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
        {}
      );
      expect(ensureMessageIsValid).toHaveBeenCalledWith(
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
      (ensureMessageIsValid as jest.Mock).mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });
      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, {})
      ).rejects.toThrow(errorMessage);
      expect(bufferInstance.fill).toHaveBeenCalledTimes(1);
      expect(bufferInstance.fill).toHaveBeenCalledWith(0);
    });

    it('should throw an exception when there is no active network', async () => {
      (networkService.activeNetwork as any) = undefined;
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      await expect(
        walletService.signMessage(MessageType.ETH_SIGN, {})
      ).rejects.toThrow('no active network found');
      expect(Buffer.from).not.toHaveBeenCalled();
    });

    it('should throw an exception when MessageType is unknown', async () => {
      jest.spyOn(walletService as any, 'getWallet').mockReturnValue(walletMock);
      const mockedHash = 'mockedHash';
      (personalSign as jest.Mock).mockReturnValue(mockedHash);
      try {
        await walletService.signMessage('unknown' as MessageType, {});
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
        await walletService.signMessage(MessageType.ETH_SIGN, undefined);
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
        await walletService.signMessage(MessageType.ETH_SIGN, undefined);
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
        await walletService.signMessage(MessageType.ETH_SIGN, undefined);
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({ mnemonic });
      getAddressesSpy.mockReturnValueOnce(addressesMock);

      const result = await walletService.addAddress(1);
      expect(getAddressesSpy).toHaveBeenCalledWith(1);
      expect(result).toStrictEqual(addressesMock);
    });

    describe('ledger', () => {
      it('throws if transport is not available', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = undefined;

        await expect(walletService.addAddress(1)).rejects.toThrowError(
          'Ledger transport not available'
        );
      });

      it('throws when it fails to get EVM pubkey from ledger', async () => {
        const transportMock = {} as LedgerTransport;
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;

        (getPubKeyFromTransport as jest.Mock).mockReturnValueOnce(
          Buffer.from('')
        );

        await expect(walletService.addAddress(1)).rejects.toThrowError(
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
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;

        (getPubKeyFromTransport as jest.Mock)
          .mockReturnValueOnce(Buffer.from('evm'))
          .mockReturnValueOnce(Buffer.from(''));

        await expect(walletService.addAddress(1)).rejects.toThrowError(
          'Failed to get public key from device.'
        );
        expect(getPubKeyFromTransport).toHaveBeenCalledWith(
          transportMock,
          1,
          DerivationPath.LedgerLive
        );
      });

      it('gets the addresses correctly', async () => {
        const addressBuffEvm = Buffer.from('0x1');
        const addressBuffXP = Buffer.from('0x2');
        const transportMock = {} as LedgerTransport;
        getAddressesSpy.mockReturnValueOnce(addressesMock);
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [],
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ledgerService.recentTransport = transportMock;
        (getPubKeyFromTransport as jest.Mock)
          .mockReturnValueOnce(addressBuffEvm)
          .mockReturnValueOnce(addressBuffXP);

        const result = await walletService.addAddress(0);
        expect(getAddressesSpy).toHaveBeenCalledWith(0);
        expect(result).toStrictEqual(addressesMock);
        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          pubKeys: [
            {
              evm: addressBuffEvm.toString('hex'),
              xp: addressBuffXP.toString('hex'),
            },
          ],
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
      (storageService.load as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(walletService.getAddresses(0)).rejects.toThrowError(
        'No public key available'
      );
    });

    it('returns the addresses for xpub', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        xpub: 'xpub',
        xpubXP: 'xpubXP',
      });
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        pubKeys: [],
      });
      (networkService.isMainnet as jest.Mock).mockReturnValueOnce(false);

      await expect(walletService.getAddresses(0)).rejects.toThrowError(
        'Account not added'
      );
    });

    it('returns the addresses for pubKey', async () => {
      const pubKeyBuff = Buffer.from('pubKey', 'hex');
      (storageService.load as jest.Mock).mockResolvedValueOnce({
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({
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
      expect(storageService.save).not.toHaveBeenCalled();
      await result.commit();
      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        imported: {
          [uuid]: {
            type: ImportType.PRIVATE_KEY,
            secret: 'privateKey',
          },
        },
      });
    });

    it('throws if unable to calculate public key', async () => {
      (getPublicKeyFromPrivateKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo');
      });

      (storageService.load as jest.Mock).mockResolvedValueOnce({
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

      (storageService.load as jest.Mock).mockResolvedValueOnce({
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

      (storageService.load as jest.Mock).mockResolvedValueOnce({
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        imported: {},
      });

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError(
        'Could not find an imported account with the provided identifier'
      );
    });

    it('throws if importType is not supported', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        imported: {
          id: {
            type: 'unknown',
            secret: 'secret',
          },
        },
      });

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError('Unsupported import type unknown');
    });

    it('throws if addresses are missing', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        imported: {
          id: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret',
          },
        },
      });

      (getEvmAddressFromPubKey as jest.Mock).mockReturnValueOnce('');
      (getBtcAddressFromPubKey as jest.Mock).mockReturnValueOnce('');

      await expect(
        walletService.getImportedAddresses('id')
      ).rejects.toThrowError('Missing address');
    });

    it('returns the addresses for PRIVATE_KEY correctly', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        imported: {
          id: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret',
          },
        },
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({
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

      await walletService.deleteImportedWallets(['id2', 'id3']);

      expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
        imported: {
          id1: {
            type: ImportType.PRIVATE_KEY,
            secret: 'secret1',
          },
        },
      });
    });
  });

  describe('getPublicKey', () => {
    const xpub = 'xpub';
    const xpubXP = 'xpubXP';
    const evmPub = 'evmPub';
    const xpPub = 'xpPub';

    describe('primary accounts', () => {
      it('throws if secrets are missing', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({});

        const account = {
          type: AccountType.PRIMARY,
          index: 0,
        } as PrimaryAccount;

        await expect(walletService.getPublicKey(account)).rejects.toThrowError(
          'Unable to get public key'
        );
      });

      it('throws if pubKeys for the account are missing', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [
            {
              evm: 'evmPubKey',
              xp: 'xpPubKey',
            },
          ],
        });

        const account = {
          type: AccountType.PRIMARY,
          index: 1,
        } as PrimaryAccount;

        await expect(walletService.getPublicKey(account)).rejects.toThrowError(
          'Can not find public key for the given index'
        );
      });

      it('returns the public keys based on the extended public key correctly', async () => {
        const account = {
          type: AccountType.PRIMARY,
          index: 0,
        } as PrimaryAccount;

        (storageService.load as jest.Mock).mockResolvedValueOnce({
          xpub,
          xpubXP,
        });

        (getAddressPublicKeyFromXPub as jest.Mock).mockReturnValueOnce(evmPub);
        (
          Avalanche.getAddressPublicKeyFromXpub as jest.Mock
        ).mockReturnValueOnce(xpPub);

        const result = await walletService.getPublicKey(account);

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
        const account = {
          type: AccountType.PRIMARY,
          index: 0,
        } as PrimaryAccount;

        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [
            {
              evm: evmPub,
              xp: xpPub,
            },
          ],
        });

        const result = await walletService.getPublicKey(account);

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: xpPub,
        });
      });
    });
    describe('imported accounts', () => {
      it('throws if secrets for imported account is not found', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          imported: {
            id1: {
              type: ImportType.PRIVATE_KEY,
              secret: 'secret1',
            },
          },
        });

        const account = {
          type: AccountType.IMPORTED,
          id: 'unknown',
        } as ImportedAccount;

        await expect(walletService.getPublicKey(account)).rejects.toThrowError(
          'Can not find public key for the given imported account'
        );
      });

      it('throws if the account has unknown import type', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          imported: {
            id1: {
              type: 'unknown',
              secret: 'secret1',
            },
          },
        });

        const account = {
          type: AccountType.IMPORTED,
          id: 'id1',
        } as ImportedAccount;

        await expect(walletService.getPublicKey(account)).rejects.toThrowError(
          'Unable to get public key'
        );
      });

      it('returns the public keys correctly for private key imports', async () => {
        (getPublicKeyFromPrivateKey as jest.Mock).mockReturnValueOnce(evmPub);
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          imported: {
            id1: {
              type: ImportType.PRIVATE_KEY,
              secret: 'secret1',
            },
          },
        });

        const account = {
          type: AccountType.IMPORTED,
          id: 'id1',
        } as ImportedAccount;

        const result = await walletService.getPublicKey(account);

        expect(result).toStrictEqual({
          evm: evmPub,
          xp: evmPub,
        });

        expect(getPublicKeyFromPrivateKey).toHaveBeenCalledWith('secret1');
      });
    });
  });

  describe('getAddressesInRange', () => {
    describe('mnemonic wallet', () => {
      const xpubXP = 'xpubXP';

      const getExpectedResult = (type: string, count: number) =>
        [...Array(count)].map((_, i) => `${type}_address${i}`);

      beforeEach(() => {
        (Avalanche.getAddressFromXpub as jest.Mock).mockImplementation(
          (_, index, __, ___, isChange) =>
            `X-${isChange ? 'internal' : 'external'}_address${index}`
        );
      });

      it('throws if external start index is incorrect', async () => {
        await expect(
          walletService.getAddressesInRange(-1, 0)
        ).rejects.toThrowError('Invalid start index');
      });

      it('throws if internal start index is incorrect', async () => {
        await expect(
          walletService.getAddressesInRange(0, -1)
        ).rejects.toThrowError('Invalid start index');
      });

      it('returns the address list correctly', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          xpubXP,
        });

        const result = await walletService.getAddressesInRange(0, 0, 2, 2);

        expect(result).toEqual({
          external: getExpectedResult('external', 2),
          internal: getExpectedResult('internal', 2),
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(4);
      });

      it('sets the limit to 0 if not provided', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          xpubXP,
        });

        const result = await walletService.getAddressesInRange(0, 0);
        expect(result).toStrictEqual({
          external: [],
          internal: [],
        });
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(0);
      });

      it('sets the limit to 100 if the provided is over 100', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          xpubXP,
        });

        const result = await walletService.getAddressesInRange(
          0,
          0,
          1000,
          1000
        );
        expect(result.external).toHaveLength(100);
        expect(result.internal).toHaveLength(100);
        expect(Avalanche.getAddressFromXpub).toHaveBeenCalledTimes(200);
      });
    });
  });

  describe('migrateMissingXPPublicKeys', () => {
    beforeEach(() => {
      walletService['_walletType'] = WalletType.LEDGER;
      (ledgerService as any).recentTransport = {} as LedgerTransport;
      (storageService.load as jest.Mock).mockResolvedValue({
        pubKeys: [{ evm: 'evm', xp: 'xp' }],
      });
    });

    it('throws if storage is empty', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce(undefined);
      await expect(
        walletService.migrateMissingXPPublicKeys()
      ).rejects.toThrowError(
        'Error while searching for missing public keys: storage is empty.'
      );
    });

    it('terminates early if wallet type is incorrect', async () => {
      walletService['_walletType'] = WalletType.MNEMONIC;
      await expect(
        walletService.migrateMissingXPPublicKeys()
      ).resolves.toBeUndefined();
      expect(storageService.save).not.toHaveBeenCalled();
    });

    it('throws if transport is missing', async () => {
      (ledgerService as any).recentTransport = undefined;
      (storageService.load as jest.Mock).mockResolvedValue({
        pubKeys: [{ evm: 'evm', xp: '' }],
      });
      (ledgerService as any).recentTransport = undefined;
      await expect(
        walletService.migrateMissingXPPublicKeys()
      ).rejects.toThrowError('Ledger transport not available');
    });

    describe('Derivation path: BIP44', () => {
      beforeEach(() => {
        walletService['_derivationPath'] = DerivationPath.BIP44;
      });

      it('terminates early if there is nothing to update', async () => {
        (storageService.load as jest.Mock).mockResolvedValue({
          xpubXP: 'existing xpubXP',
        });
        await expect(
          walletService.migrateMissingXPPublicKeys()
        ).resolves.toBeUndefined();
        expect(storageService.save).not.toHaveBeenCalled();
      });

      it('updates the extended public key correctly', async () => {
        const secrets = { xpub: 'xpub' };
        (storageService.load as jest.Mock).mockResolvedValue(secrets);
        (getLedgerExtendedPublicKey as jest.Mock).mockResolvedValueOnce(
          'xpubXP'
        );

        await expect(
          walletService.migrateMissingXPPublicKeys()
        ).resolves.toBeUndefined();
        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          ...secrets,
          xpubXP: 'xpubXP',
        });
      });
    });

    describe('Derivation path: Ledger Live', () => {
      beforeEach(() => {
        walletService['_derivationPath'] = DerivationPath.LedgerLive;
      });

      it('terminates early if there is nothing to update', async () => {
        await expect(
          walletService.migrateMissingXPPublicKeys()
        ).resolves.toBeUndefined();
        expect(storageService.save).not.toHaveBeenCalled();
      });

      it('updates the pubkeys and throws if an error happened', async () => {
        const secrets = {
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            { evm: 'evm2', xp: '' },
            { evm: 'evm3', xp: '' },
          ],
        };
        (storageService.load as jest.Mock).mockResolvedValue(secrets);

        (getPubKeyFromTransport as jest.Mock)
          .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
          .mockRejectedValueOnce('some error');

        await expect(
          walletService.migrateMissingXPPublicKeys()
        ).rejects.toThrowError(
          'Error while searching for missing public keys: incomplete migration.'
        );

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            {
              evm: 'evm2',
              xp: '1234',
            },
            { evm: 'evm3', xp: '' },
          ],
        });

        expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
          1,
          {},
          1,
          DerivationPath.LedgerLive,
          'AVM'
        );
        expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
          2,
          {},
          2,
          DerivationPath.LedgerLive,
          'AVM'
        );
      });

      it('updates the pubkeys correctly', async () => {
        const secrets = {
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            { evm: 'evm2', xp: '' },
            { evm: 'evm3', xp: '' },
          ],
        };
        (storageService.load as jest.Mock).mockResolvedValue(secrets);

        (getPubKeyFromTransport as jest.Mock)
          .mockResolvedValueOnce(Buffer.from('1234', 'hex'))
          .mockResolvedValueOnce(Buffer.from('5678', 'hex'));

        await expect(
          walletService.migrateMissingXPPublicKeys()
        ).resolves.toBeUndefined();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          pubKeys: [
            { evm: 'evm', xp: 'xp' },
            {
              evm: 'evm2',
              xp: '1234',
            },
            { evm: 'evm3', xp: '5678' },
          ],
        });

        expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
          1,
          {},
          1,
          DerivationPath.LedgerLive,
          'AVM'
        );
        expect(getPubKeyFromTransport).toHaveBeenNthCalledWith(
          2,
          {},
          2,
          DerivationPath.LedgerLive,
          'AVM'
        );
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

    beforeEach(() => {
      walletService['_walletType'] = WalletType.LEDGER;
    });

    it('returns undefined if account is not provided', async () => {
      await expect(
        walletService.getBtcWalletPolicyDetails()
      ).resolves.toBeUndefined();
    });

    it('returns undefined if account is not primary', async () => {
      await expect(
        walletService.getBtcWalletPolicyDetails({
          type: AccountType.IMPORTED,
        } as Account)
      ).resolves.toBeUndefined();
    });

    it('returns undefined if wallet type is not Ledger', async () => {
      walletService['_walletType'] = WalletType.MNEMONIC;

      await expect(
        walletService.getBtcWalletPolicyDetails({
          type: AccountType.PRIMARY,
        } as Account)
      ).resolves.toBeUndefined();
    });

    it('returns the policy details correctly for Ledger Live', async () => {
      walletService['_derivationPath'] = DerivationPath.LedgerLive;
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        pubKeys: [
          {
            btcWalletPolicyDetails,
          },
        ],
      });

      await expect(
        walletService.getBtcWalletPolicyDetails({
          type: AccountType.PRIMARY,
          index: 0,
        } as Account)
      ).resolves.toBe(btcWalletPolicyDetails);
    });

    it('returns the policy details correctly for BIP44', async () => {
      walletService['_derivationPath'] = DerivationPath.BIP44;
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        btcWalletPolicyDetails,
      });

      await expect(
        walletService.getBtcWalletPolicyDetails({
          type: AccountType.PRIMARY,
          index: 0,
        } as Account)
      ).resolves.toBe(btcWalletPolicyDetails);
    });
  });

  describe('storeBtcWalletPolicyDetails', () => {
    const hmacHex = '0x1';
    const xpub = '0x2';
    const masterFingerprint = '1234';
    const name = 'policy';

    beforeEach(() => {
      walletService['_walletType'] = WalletType.LEDGER;
      walletService['_derivationPath'] = DerivationPath.LedgerLive;
    });

    const storeBtcWalletPolicyDetails = async () =>
      walletService.storeBtcWalletPolicyDetails(
        0,
        xpub,
        masterFingerprint,
        hmacHex,
        name
      );

    it('throws if wallet type is not Ledger', async () => {
      walletService['_walletType'] = WalletType.MNEMONIC;

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
        'Error while saving wallet policy details: incorrect wallet type.'
      );
    });

    it('throws if storage is empty', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce(undefined);

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
        'Error while saving wallet policy details: storage is empty.'
      );
    });

    it('throws for unknown derivation paths', async () => {
      walletService['_derivationPath'] = undefined;
      (storageService.load as jest.Mock).mockResolvedValueOnce({});

      await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
        'Error while saving wallet policy details: unknown derivation path.'
      );
    });

    describe('Derivation path: Ledger Live', () => {
      beforeEach(() => {
        walletService['_derivationPath'] = DerivationPath.LedgerLive;
      });

      it('throws if storage is empty for the given index', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: missing record for the provided index.'
        );
      });

      it('throws if storage is already contains policy info for the given index', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [
            {
              btcWalletPolicyDetails: {},
            },
          ],
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          pubKeys: [
            {
              evm: '0x1',
              xp: '0x2',
            },
          ],
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          pubKeys: [
            {
              evm: '0x1',
              xp: '0x2',
              btcWalletPolicyDetails: {
                xpub,
                masterFingerprint,
                hmacHex,
                name,
              },
            },
          ],
        });
      });
    });

    describe('Derivation path: BIP44', () => {
      beforeEach(() => {
        walletService['_derivationPath'] = DerivationPath.BIP44;
      });

      it('throws if storage is already contains policy', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          btcWalletPolicyDetails: {},
        });

        await expect(storeBtcWalletPolicyDetails()).rejects.toThrowError(
          'Error while saving wallet policy details: policy details already stored.'
        );
      });

      it('stores the policy details correctly', async () => {
        (storageService.load as jest.Mock).mockResolvedValueOnce({
          xpub: 'xpub',
          xpubXP: 'xpubXP',
        });

        await storeBtcWalletPolicyDetails();

        expect(storageService.save).toHaveBeenCalledWith(WALLET_STORAGE_KEY, {
          xpub: 'xpub',
          xpubXP: 'xpubXP',
          btcWalletPolicyDetails: {
            xpub,
            masterFingerprint,
            hmacHex,
            name,
          },
        });
      });
    });
  });

  describe('parseWalletPolicyDetails', () => {
    let getBtcWalletPolicyDetailsSpy: jest.SpyInstance;

    const hmacHex = '123654';
    const xpub = '0x1';
    const masterFingerprint = '1234';
    const name = 'policy';
    const walletPolicy = {} as WalletPolicy;

    beforeEach(() => {
      getBtcWalletPolicyDetailsSpy = jest.spyOn(
        walletService as any,
        'getBtcWalletPolicyDetails'
      );
    });

    it('throws if it fails to find policy details', async () => {
      getBtcWalletPolicyDetailsSpy.mockResolvedValueOnce(undefined);

      await expect(
        walletService['parseWalletPolicyDetails']({ index: 0 } as Account)
      ).rejects.toThrowError(
        'Error while parsing wallet policy: missing data.'
      );
    });

    it('returns the correct data for Ledger Live', async () => {
      walletService['_derivationPath'] = DerivationPath.LedgerLive;
      getBtcWalletPolicyDetailsSpy.mockResolvedValueOnce({
        xpub,
        masterFingerprint,
        hmacHex,
        name,
      });

      (createWalletPolicy as jest.Mock).mockReturnValueOnce(walletPolicy);

      await expect(
        walletService['parseWalletPolicyDetails']({ index: 1 } as Account)
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
      walletService['_derivationPath'] = DerivationPath.BIP44;
      getBtcWalletPolicyDetailsSpy.mockResolvedValueOnce({
        xpub,
        masterFingerprint,
        hmacHex,
        name,
      });

      (createWalletPolicy as jest.Mock).mockReturnValueOnce(walletPolicy);

      await expect(
        walletService['parseWalletPolicyDetails']({ index: 1 } as Account)
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
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        mnemonic,
      });

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'X',
        false
      );

      expect(result).toStrictEqual([]);
    });

    it('returns an empty array if isChange is true for P chain', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        xpubXP,
      });

      const result = await walletService.getAddressesByIndices(
        [1, 2],
        'P',
        true
      );

      expect(result).toStrictEqual([]);
    });

    it('returns the correct list of addresses', async () => {
      (storageService.load as jest.Mock).mockResolvedValueOnce({
        xpubXP,
      });

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
