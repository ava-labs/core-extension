import { EventEmitter } from 'events';
import { singleton } from 'tsyringe';
import {
  PubKeyType,
  SeedlessAuthProvider,
  SigningResult,
  SignTransactionRequest,
  WalletEvents,
  WalletType,
} from './models';
import { MessageType } from '../messages/models';
import {
  Avalanche,
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  createWalletPolicy,
  DerivationPath,
  getAddressDerivationPath,
  getAddressFromXPub,
  getAddressPublicKeyFromXPub,
  getBech32AddressFromXPub,
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPubKeyFromTransport,
  getPublicKeyFromPrivateKey,
  getWalletFromMnemonic,
  JsonRpcBatchInternal,
  LedgerSigner,
} from '@avalabs/wallets-sdk';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';
import { NetworkService } from '../network/NetworkService';
import { Network, NetworkVMType } from '@avalabs/chains-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { LedgerService } from '../ledger/LedgerService';
import { BaseWallet, Wallet } from 'ethers';
import { networks, Transaction } from 'bitcoinjs-lib';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
import { ImportData, ImportType } from '../accounts/models';
import getDerivationPath from './utils/getDerivationPath';
import ensureMessageIsValid from './utils/ensureMessageFormatIsValid';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { KeystoneService } from '../keystone/KeystoneService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';
import { WalletConnectSigner } from '../walletConnect/WalletConnectSigner';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { FireblocksBTCSigner } from '../fireblocks/FireblocksBTCSigner';
import { Action } from '../actions/models';
import { UnsignedTx } from '@avalabs/avalanchejs-v2';
import { toUtf8 } from 'ethereumjs-util';
import { FireblocksService } from '../fireblocks/FireblocksService';
import { SecretsService } from '../secrets/SecretsService';
import { SecretType } from '../secrets/models';
import { FIREBLOCKS_REQUEST_EXPIRY } from '../fireblocks/models';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';

@singleton()
export class WalletService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();
  private _walletType?: WalletType;
  private _derivationPath?: DerivationPath;

  constructor(
    private networkService: NetworkService,
    private ledgerService: LedgerService,
    private keystoneService: KeystoneService,
    private walletConnectService: WalletConnectService,
    private fireblocksService: FireblocksService,
    private secretService: SecretsService
  ) {}

  public get walletType(): WalletType | undefined {
    return this._walletType;
  }

  public get derivationPath(): DerivationPath | undefined {
    return this._derivationPath;
  }

  private emitWalletState() {
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, {
      walletType: this._walletType,
      derivationPath: this._derivationPath,
    });
  }

  async onUnlock(): Promise<void> {
    const secrets = await this.secretService.getPrimaryAccountSecrets();

    if (!secrets) {
      this.emitWalletState();
      // wallet is not initialized
      return;
    }

    switch (secrets.type) {
      case SecretType.Seedless:
        this._walletType = WalletType.SEEDLESS;
        break;
      case SecretType.Mnemonic:
        this._walletType = WalletType.MNEMONIC;
        break;

      case SecretType.Ledger:
      case SecretType.LedgerLive:
        this._walletType = WalletType.LEDGER;
        break;

      case SecretType.Keystone:
        this._walletType = WalletType.KEYSTONE;
        break;

      default:
        throw new Error('Wallet initialization failed, no key found');
    }

    this._derivationPath = secrets.derivationPath;
    this.emitWalletState();
  }

  /**
   * Called during the onboarding flow.
   * Responsible for saving the mnemonic/pubkey and activating the wallet.
   */
  async init({
    mnemonic,
    xpub,
    xpubXP,
    pubKeys,
    masterFingerprint,
    seedlessSignerToken,
    authProvider,
  }: {
    xpub?: string;
    xpubXP?: string;
    pubKeys?: PubKeyType[];
    mnemonic?: string;
    masterFingerprint?: string;
    seedlessSignerToken?: SignerSessionData;
    authProvider?: SeedlessAuthProvider;
  }) {
    if (seedlessSignerToken) {
      const seedlessStorage = new SeedlessTokenStorage(this.secretService);
      await seedlessStorage.save(seedlessSignerToken);
      const seedlessWallet = new SeedlessWallet(
        this.networkService,
        seedlessStorage
      );
      pubKeys = await seedlessWallet.getPublicKeys();

      if (!pubKeys.length) {
        throw new Error('Unable to get pubkey for seedless wallet');
      }
    }

    if (!mnemonic && !xpub && !pubKeys?.length) {
      throw new Error('Mnemonic, pubKeys or xpub is required');
    }

    const derivationPath = getDerivationPath({ mnemonic, xpub, pubKeys });

    await this.secretService.updateSecrets({
      mnemonic,
      xpub,
      pubKeys,
      xpubXP,
      derivationPath,
      masterFingerprint,
      authProvider,
    });
    await this.onUnlock();
  }

  onLock() {
    this._walletType = undefined;
    this._derivationPath = undefined;
    this.emitWalletState();
  }

  private async getWallet(network?: Network, tabId?: number) {
    const secrets = await this.secretService.getActiveAccountSecrets();
    const activeNetwork = network || this.networkService.activeNetwork;

    if (!activeNetwork || !secrets.account) {
      // wallet is not initialized
      return;
    }

    const provider = this.networkService.getProviderForNetwork(activeNetwork);
    const { type } = secrets;

    // Seedless wallet uses a universal signer class (one for all tx types)
    if (type === SecretType.Seedless) {
      const addressPublicKey = secrets.pubKeys[secrets.account.index];

      if (!addressPublicKey) {
        throw new Error('Account public key not available');
      }

      const wallet = new SeedlessWallet(
        this.networkService,
        new SeedlessTokenStorage(this.secretService),
        activeNetwork,
        addressPublicKey
      );
      return wallet;
    }

    // EVM signers
    if (activeNetwork.vmName === NetworkVMType.EVM) {
      if (type === SecretType.Mnemonic) {
        const signer = getWalletFromMnemonic(
          secrets.mnemonic,
          secrets.account.index,
          secrets.derivationPath
        );
        return signer.connect(provider as JsonRpcBatchInternal);
      }

      if (type === SecretType.Ledger || type === SecretType.LedgerLive) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new LedgerSigner(
          secrets.account.index,
          this.ledgerService.recentTransport,
          secrets.derivationPath,
          provider as JsonRpcBatchInternal
        );
      }

      if (type === SecretType.Keystone) {
        return new KeystoneWallet(
          secrets.masterFingerprint,
          secrets.account.index,
          this.keystoneService,
          activeNetwork.chainId,
          tabId
        );
      }

      if (type === SecretType.Fireblocks || type === SecretType.WalletConnect) {
        return new WalletConnectSigner(
          this.walletConnectService,
          activeNetwork.chainId,
          secrets.account.addressC,
          tabId,
          // Due to Fireblocks nature, transaction sign requests may need
          // more time than WalletConnect's default of 5 minutes.
          type === SecretType.Fireblocks ? FIREBLOCKS_REQUEST_EXPIRY : undefined
        );
      }

      if (type === SecretType.PrivateKey) {
        return new Wallet(secrets.secret, provider as JsonRpcBatchInternal);
      }

      throw new Error(
        `No proper signer could be constructed for EVM and ${type} account`
      );
    }

    // Bitcoin signers
    if (activeNetwork.vmName === NetworkVMType.BITCOIN) {
      if (type === SecretType.Mnemonic) {
        return await BitcoinWallet.fromMnemonic(
          secrets.mnemonic,
          secrets.account.index,
          provider as BitcoinProviderAbstract
        );
      }
      if (type === SecretType.Fireblocks) {
        if (!secrets.api) {
          throw new Error(`Fireblocks API access keys not configured`);
        }

        return new FireblocksBTCSigner(
          this.fireblocksService,
          secrets.api.vaultAccountId,
          activeNetwork.isTestnet
        );
      }

      if (type === SecretType.PrivateKey) {
        return new BitcoinWallet(
          Buffer.from(secrets.secret, 'hex'),
          provider as BitcoinProviderAbstract
        );
      }

      if (type === SecretType.Keystone) {
        return new BitcoinKeystoneWallet(
          secrets.masterFingerprint,
          getAddressPublicKeyFromXPub(secrets.xpub, secrets.account.index),
          getAddressDerivationPath(
            secrets.account.index,
            secrets.derivationPath,
            'EVM'
          ),
          this.keystoneService,
          provider as BitcoinProviderAbstract,
          tabId
        );
      }

      if (type === SecretType.Ledger) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails();

        return new BitcoinLedgerWallet(
          getAddressPublicKeyFromXPub(secrets.xpub, secrets.account.index),
          getAddressDerivationPath(
            secrets.account.index,
            secrets.derivationPath,
            'EVM'
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      }

      if (type === SecretType.LedgerLive) {
        // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const accountIndex = secrets.account.index;
        const addressPublicKey = secrets.pubKeys[accountIndex];

        if (!addressPublicKey) {
          throw new Error('Account public key not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails();

        return new BitcoinLedgerWallet(
          Buffer.from(addressPublicKey.evm, 'hex'),
          getAddressDerivationPath(accountIndex, secrets.derivationPath, 'EVM'),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      }

      throw new Error(
        `No proper signer could be constructed for Bitcoin and ${type} account`
      );
    }

    // Avalanche signers
    if (
      activeNetwork.vmName === NetworkVMType.AVM ||
      activeNetwork.vmName === NetworkVMType.PVM
    ) {
      if (type === SecretType.Mnemonic) {
        return new Avalanche.SimpleSigner(
          secrets.mnemonic,
          secrets.account.index
        );
      }

      if (type === SecretType.Ledger) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        return new Avalanche.SimpleLedgerSigner(
          secrets.account.index,
          provider as Avalanche.JsonRpcProvider,
          secrets.xpubXP
        );
      }

      if (type === SecretType.LedgerLive) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const accountIndex = secrets.account.index;
        const pubkey = secrets.pubKeys[accountIndex];

        if (!pubkey) {
          throw new Error('Cannot find public key for the active account');
        }

        // Verify public key exists for X/P path
        if (!pubkey.xp) {
          throw new Error('X/P Chain public key is not set');
        }

        // TODO: SimpleLedgerSigner doesn't support LedgerLive derivation paths ATM
        // https://ava-labs.atlassian.net/browse/CP-5861
        return new Avalanche.LedgerSigner(
          Buffer.from(pubkey.xp, 'hex'),
          getAddressDerivationPath(
            accountIndex,
            DerivationPath.LedgerLive,
            'AVM'
          ),
          Buffer.from(pubkey.evm, 'hex'),
          getAddressDerivationPath(
            accountIndex,
            DerivationPath.LedgerLive,
            'EVM'
          ),
          provider as Avalanche.JsonRpcProvider
        );
      }

      if (type === SecretType.WalletConnect) {
        return new WalletConnectSigner(
          this.walletConnectService,
          activeNetwork.chainId,
          secrets.account.addressC,
          tabId
        );
      }

      if (type === SecretType.PrivateKey) {
        return new Avalanche.StaticSigner(
          Buffer.from(secrets.secret, 'hex'),
          Buffer.from(secrets.secret, 'hex'),
          provider as Avalanche.JsonRpcProvider
        );
      }

      throw new Error(
        `No proper signer could be constructed for Avalanche and ${type} account`
      );
    }
  }

  async sign(
    tx: SignTransactionRequest,
    tabId?: number,
    network?: Network,
    originalRequestMethod?: string
  ): Promise<SigningResult> {
    const wallet = await this.getWallet(network, tabId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // handle BTC signing
    if ('inputs' in tx) {
      if (
        !(wallet instanceof BitcoinWallet) &&
        !(wallet instanceof BitcoinLedgerWallet) &&
        !(wallet instanceof BitcoinKeystoneWallet) &&
        !(wallet instanceof FireblocksBTCSigner) &&
        !(wallet instanceof SeedlessWallet)
      ) {
        throw new Error('Signing error, wrong network');
      }

      // prepare transaction for ledger signing
      const txToSign =
        wallet instanceof BitcoinLedgerWallet
          ? await prepareBtcTxForLedger(
              tx,
              await this.networkService.getBitcoinProvider()
            )
          : tx;

      const result = await wallet.signTx(txToSign.inputs, txToSign.outputs);

      return this.#normalizeSigningResult(result);
    }

    // Handle Avalanche signing, X/P/CoreEth
    if ('tx' in tx) {
      if (
        !(wallet instanceof Avalanche.SimpleSigner) &&
        !(wallet instanceof Avalanche.StaticSigner) &&
        !(wallet instanceof Avalanche.SimpleLedgerSigner) &&
        !(wallet instanceof Avalanche.LedgerSigner) &&
        !(wallet instanceof WalletConnectSigner) &&
        !(wallet instanceof SeedlessWallet)
      ) {
        throw new Error('Signing error, wrong network');
      }
      const txToSign = {
        tx: tx.tx,
        ...((wallet instanceof Avalanche.SimpleLedgerSigner ||
          wallet instanceof Avalanche.LedgerSigner) && {
          transport: this.ledgerService.recentTransport,
        }),
        externalIndices: tx.externalIndices,
        internalIndices: tx.internalIndices,
      };

      const result =
        wallet instanceof SeedlessWallet
          ? await wallet.signAvalancheTx(txToSign)
          : await wallet.signTx(txToSign, originalRequestMethod);

      return this.#normalizeSigningResult(result);
    }

    if (
      !(wallet instanceof BaseWallet) &&
      !(wallet instanceof LedgerSigner) &&
      !(wallet instanceof KeystoneWallet) &&
      !(wallet instanceof WalletConnectSigner) &&
      !(wallet instanceof SeedlessWallet)
    ) {
      throw new Error('Signing error, wrong network');
    }

    return this.#normalizeSigningResult(await wallet.signTransaction(tx));
  }

  /**
   * Wallet implementations may return either a string or a SigningResult object.
   * If the wallet returns a string, we treat it as signed TX.
   */
  #normalizeSigningResult(
    signingResult: string | UnsignedTx | Transaction | SigningResult
  ): SigningResult {
    if (typeof signingResult === 'string') {
      return { signedTx: signingResult };
    }

    if (signingResult instanceof UnsignedTx) {
      return { signedTx: JSON.stringify(signingResult.toJSON()) };
    }

    if (signingResult instanceof Transaction) {
      return { signedTx: signingResult.toHex() };
    }

    return signingResult;
  }

  /**
   * Get the public key of an account index
   * @throws Will throw error for LedgerLive accounts that have not been added yet.
   */
  async getActiveAccountPublicKey(): Promise<PubKeyType> {
    const secrets = await this.secretService.getActiveAccountSecrets();

    if (secrets.type === SecretType.Fireblocks) {
      // TODO: We technically can fetch some public keys using the API,
      // but is it feasible? What about WalletConnect? I don't think we
      // can fetch them via WalletConnect alone.
      throw new Error('Public key is not known for Fireblocks accounts');
    }

    if (secrets.type === SecretType.WalletConnect) {
      if (!secrets.pubKey) {
        throw new Error('This account does not have its public key imported');
      }

      return secrets.pubKey;
    }

    if (secrets.type === SecretType.PrivateKey) {
      if (!secrets.secret) {
        throw new Error(
          'Cannot find public key for the given imported account'
        );
      }

      const publicKey = getPublicKeyFromPrivateKey(secrets.secret).toString(
        'hex'
      );

      return {
        evm: publicKey,
        xp: publicKey,
      };
    }

    if (secrets.type === SecretType.Mnemonic && secrets.account) {
      const evmPub = getAddressPublicKeyFromXPub(
        secrets.xpub,
        secrets.account.index
      );
      const xpPub = Avalanche.getAddressPublicKeyFromXpub(
        secrets.xpubXP,
        secrets.account.index
      );

      return {
        evm: evmPub.toString('hex'),
        xp: xpPub.toString('hex'),
      };
    }

    if (
      secrets.type === SecretType.Ledger &&
      secrets.xpubXP &&
      secrets.account
    ) {
      const evmPub = getAddressPublicKeyFromXPub(
        secrets.xpub,
        secrets.account.index
      );
      const xpPub = Avalanche.getAddressPublicKeyFromXpub(
        secrets.xpubXP,
        secrets.account.index
      );

      return {
        evm: evmPub.toString('hex'),
        xp: xpPub.toString('hex'),
      };
    }

    if (
      (secrets.type === SecretType.LedgerLive ||
        secrets.type === SecretType.Seedless) &&
      secrets.account
    ) {
      const publicKey = secrets.pubKeys[secrets.account.index];

      if (!publicKey)
        throw new Error('Can not find public key for the given index');

      return publicKey;
    }

    throw new Error('Unable to get public key');
  }

  /**
   * Signs the given message
   * @param data Message in hex format. Will be parsed as UTF8.
   */
  private async signMessageAvalanche(data: string) {
    const message = toUtf8(data);
    const xpNetwork = this.networkService.getAvalancheNetworkXP();
    const wallet = await this.getWallet(xpNetwork);

    //TODO: Need support for WalletConnectSigner when mobile is ready
    if (
      !(wallet instanceof Avalanche.SimpleSigner) &&
      !(wallet instanceof Avalanche.StaticSigner) &&
      !(wallet instanceof Avalanche.SimpleLedgerSigner) &&
      !(wallet instanceof Avalanche.LedgerSigner)
    ) {
      throw new Error('Signing error, wrong network');
    }
    // TODO: These are currently fixed to X/P chains, do we need core eth support?

    if (wallet instanceof Avalanche.SimpleLedgerSigner) {
      if (!this.ledgerService.recentTransport) {
        throw new Error('Ledger transport not available');
      }

      return await wallet.signMessage({
        message,
        chain: 'X',
        transport: this.ledgerService.recentTransport,
      });
    }

    return await wallet.signMessage({ message, chain: 'X' });
  }
  /**
   * Sign EVM messages
   * @param messageType
   * @param data
   */
  async signMessage(messageType: MessageType, action: Action) {
    const wallet = await this.getWallet();
    const activeNetwork = this.networkService.activeNetwork;

    if (!activeNetwork) {
      throw new Error(`no active network found`);
    }

    const data = action.displayData?.messageParams?.data;

    ensureMessageIsValid(messageType, data, activeNetwork.chainId);

    if (wallet instanceof WalletConnectSigner) {
      return await wallet.signMessage(messageType, action.params);
    }

    if (wallet instanceof SeedlessWallet) {
      return wallet.signMessage(messageType, action.displayData?.messageParams);
    }

    if (messageType === MessageType.AVALANCHE_SIGN) {
      return this.signMessageAvalanche(data);
    }

    if (!wallet || !(wallet instanceof BaseWallet)) {
      throw new Error(
        wallet
          ? `this function not supported on your wallet`
          : 'wallet undefined in sign tx'
      );
    }

    const privateKey = wallet.privateKey.toLowerCase().startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey;

    const key = Buffer.from(privateKey, 'hex');

    try {
      if (data) {
        switch (messageType) {
          case MessageType.ETH_SIGN:
          case MessageType.PERSONAL_SIGN:
            return personalSign({ privateKey: key, data });
          case MessageType.SIGN_TYPED_DATA:
          case MessageType.SIGN_TYPED_DATA_V1:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V1,
            });
          case MessageType.SIGN_TYPED_DATA_V3:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V3,
            });
          case MessageType.SIGN_TYPED_DATA_V4:
            return signTypedData({
              privateKey: key,
              data,
              version: SignTypedDataVersion.V4,
            });
          default:
            throw new Error('unknown method');
        }
      } else {
        throw new Error('no message to sign');
      }
    } finally {
      key.fill(0);
    }
  }

  addListener(event: WalletEvents, callback: (data: unknown) => void) {
    this.eventEmitter.on(event, callback);
  }

  async addAddress(index: number): Promise<Record<NetworkVMType, string>> {
    const secrets = await this.secretService.getActiveAccountSecrets();

    if (secrets.type === SecretType.LedgerLive) {
      // With LedgerLive, we don't have xPub or Mnemonic, so we need
      // to get the new address pubkey from the Ledger device.
      if (!this.ledgerService.recentTransport) {
        throw new Error('Ledger transport not available');
      }

      // Get EVM public key from transport
      const addressPublicKeyC = await getPubKeyFromTransport(
        this.ledgerService.recentTransport,
        index,
        secrets.derivationPath
      );

      // Get X/P public key from transport
      const addressPublicKeyXP = await getPubKeyFromTransport(
        this.ledgerService.recentTransport,
        index,
        secrets.derivationPath,
        'AVM'
      );

      if (
        !addressPublicKeyC ||
        !addressPublicKeyC.byteLength ||
        !addressPublicKeyXP ||
        !addressPublicKeyXP.byteLength
      ) {
        throw new Error('Failed to get public key from device.');
      }

      const pubKeys = [...(secrets?.pubKeys || [])];
      pubKeys[index] = {
        evm: addressPublicKeyC.toString('hex'),
        xp: addressPublicKeyXP.toString('hex'),
      };

      await this.secretService.updateSecrets({
        pubKeys,
      });
    }

    return this.getAddresses(index);
  }

  async getAddresses(
    index: number
  ): Promise<Record<NetworkVMType, string> | never> {
    const secrets = await this.secretService.getPrimaryAccountSecrets();

    if (!secrets) {
      throw new Error('Wallet is not initialized');
    }

    const isMainnet = this.networkService.isMainnet();
    const provXP = await this.networkService.getAvalanceProviderXP();

    if (
      secrets.type === SecretType.Ledger ||
      secrets.type === SecretType.Mnemonic ||
      secrets.type === SecretType.Keystone
    ) {
      // C-avax... this address uses the same public key as EVM
      const cPubkey = getAddressPublicKeyFromXPub(secrets.xpub, index);
      const cAddr = provXP.getAddress(cPubkey, 'C');

      let xAddr, pAddr;
      // We can only get X/P addresses if xpubXP is set
      if (secrets.xpubXP) {
        // X and P addresses different derivation path m/44'/9000'/0'...
        const xpPub = Avalanche.getAddressPublicKeyFromXpub(
          secrets.xpubXP,
          index
        );
        xAddr = provXP.getAddress(xpPub, 'X');
        pAddr = provXP.getAddress(xpPub, 'P');
      }

      return {
        [NetworkVMType.EVM]: getAddressFromXPub(secrets.xpub, index),
        [NetworkVMType.BITCOIN]: getBech32AddressFromXPub(
          secrets.xpub,
          index,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
        [NetworkVMType.AVM]: xAddr,
        [NetworkVMType.PVM]: pAddr,
        [NetworkVMType.CoreEth]: cAddr,
      };
    }

    if (
      secrets.type === SecretType.LedgerLive ||
      secrets.type === SecretType.Seedless
    ) {
      // pubkeys are used for LedgerLive derivation paths m/44'/60'/n'/0/0
      // and for X/P derivation paths  m/44'/9000'/n'/0/0
      const addressPublicKey = secrets.pubKeys[index];

      if (!addressPublicKey?.evm) {
        throw new Error('Account not added');
      }

      const pubKeyBuffer = Buffer.from(addressPublicKey.evm, 'hex');

      // X/P addresses use a different public key because derivation path is different
      let addrX, addrP;
      if (addressPublicKey.xp) {
        const pubKeyBufferXP = Buffer.from(addressPublicKey.xp, 'hex');
        addrX = provXP.getAddress(pubKeyBufferXP, 'X');
        addrP = provXP.getAddress(pubKeyBufferXP, 'P');
      }

      return {
        [NetworkVMType.EVM]: getEvmAddressFromPubKey(pubKeyBuffer),
        [NetworkVMType.BITCOIN]: getBtcAddressFromPubKey(
          pubKeyBuffer,
          isMainnet ? networks.bitcoin : networks.testnet
        ),
        [NetworkVMType.AVM]: addrX,
        [NetworkVMType.PVM]: addrP,
        [NetworkVMType.CoreEth]: provXP.getAddress(pubKeyBuffer, 'C'),
      };
    }

    throw new Error('No public key available');
  }

  async getAddressesByIndices(
    indices: number[],
    chainAlias: 'X' | 'P',
    isChange: boolean
  ) {
    const provXP = await this.networkService.getAvalanceProviderXP();
    const secrets = await this.secretService.getPrimaryAccountSecrets();

    if (!secrets || !secrets.xpubXP) {
      return [];
    }

    if (isChange && chainAlias !== 'X') {
      return [];
    }

    return indices.map((index) =>
      Avalanche.getAddressFromXpub(
        secrets.xpubXP as string,
        index,
        provXP,
        chainAlias,
        isChange
      )
    );
  }

  async addImportedWallet(importData: ImportData) {
    const id = crypto.randomUUID();

    // let the AccountService validate the account's uniqueness and save the secret using this callback
    const commit = async () => {
      // Need to re-map `data` to `secret` for private key imports
      const data =
        importData.importType === ImportType.PRIVATE_KEY
          ? {
              type: ImportType.PRIVATE_KEY as const,
              secret: importData.data,
            }
          : {
              type: importData.importType,
              ...importData.data,
            };

      await this.secretService.saveImportedWallet(id, data);
    };

    if (
      importData.importType === ImportType.FIREBLOCKS ||
      importData.importType === ImportType.WALLET_CONNECT
    ) {
      return {
        account: {
          id,
          ...importData.data.addresses,
        },
        commit,
      };
    }

    if (importData.importType === ImportType.PRIVATE_KEY) {
      return {
        account: {
          id,
          ...this.#calculateAddressesForPrivateKey(importData.data),
        },
        commit,
      };
    }

    throw new Error('Unknown import type');
  }

  async getImportedAddresses(id: string) {
    const secrets = await this.secretService.getImportedAccountSecrets(id);

    if (
      secrets.type === SecretType.WalletConnect ||
      secrets.type === SecretType.Fireblocks
    ) {
      return secrets.addresses;
    }

    if (secrets.type === SecretType.PrivateKey) {
      return this.#calculateAddressesForPrivateKey(secrets.secret);
    }

    throw new Error('Unsupported import type');
  }

  #calculateAddressesForPrivateKey(privateKey: string) {
    const addresses = {
      addressBTC: '',
      addressC: '',
      addressAVM: '',
      addressPVM: '',
      addressCoreEth: '',
    };

    const isMainnet = this.networkService.isMainnet();
    const provXP = isMainnet
      ? Avalanche.JsonRpcProvider.getDefaultMainnetProvider()
      : Avalanche.JsonRpcProvider.getDefaultFujiProvider();

    try {
      const publicKey = getPublicKeyFromPrivateKey(privateKey);
      addresses.addressC = getEvmAddressFromPubKey(publicKey);
      addresses.addressBTC = getBtcAddressFromPubKey(
        publicKey,
        isMainnet ? networks.bitcoin : networks.testnet
      );
      addresses.addressAVM = provXP.getAddress(publicKey, 'X');
      addresses.addressPVM = provXP.getAddress(publicKey, 'P');
      addresses.addressCoreEth = provXP.getAddress(publicKey, 'C');
    } catch (err) {
      throw new Error('Error while calculating addresses');
    }

    if (
      !addresses.addressC ||
      !addresses.addressBTC ||
      !addresses.addressAVM ||
      !addresses.addressPVM ||
      !addresses.addressCoreEth
    ) {
      throw new Error(`Missing address`);
    }

    return addresses;
  }

  async deleteImportedWallets(ids: string[]) {
    const deleted = await this.secretService.deleteImportedWallets(ids);

    Object.values(deleted).forEach(async (wallet) => {
      if (
        wallet?.type === ImportType.WALLET_CONNECT ||
        wallet?.type === ImportType.FIREBLOCKS
      ) {
        await this.walletConnectService.deleteSession(
          wallet.addresses.addressC
        );
      }
    });
  }

  private async parseWalletPolicyDetails() {
    const policyInfo = await this.secretService.getBtcWalletPolicyDetails();

    if (!policyInfo || !policyInfo.details) {
      throw new Error('Error while parsing wallet policy: missing data.');
    }

    const { accountIndex, details } = policyInfo;
    const hmac = Buffer.from(details.hmacHex, 'hex');
    const policy = createWalletPolicy(
      details.masterFingerprint,
      accountIndex,
      details.xpub,
      details.name
    );

    return {
      hmac,
      policy,
    };
  }
}
