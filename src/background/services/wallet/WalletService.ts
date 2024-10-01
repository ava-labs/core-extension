import { EventEmitter } from 'events';
import { container, singleton } from 'tsyringe';
import {
  AddPrimaryWalletSecrets,
  PubKeyType,
  SigningResult,
  SignTransactionRequest,
  WalletEvents,
  WalletDetails,
  SUPPORTED_PRIMARY_SECRET_TYPES,
} from './models';
import {
  MessageParams,
  MessageType,
  SignMessageData,
} from '../messages/models';
import {
  Avalanche,
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  createWalletPolicy,
  DerivationPath,
  getAddressDerivationPath,
  getAddressPublicKeyFromXPub,
  getPublicKeyFromPrivateKey,
  getWalletFromMnemonic,
  JsonRpcBatchInternal,
  LedgerSigner,
} from '@avalabs/core-wallets-sdk';
import { NetworkService } from '../network/NetworkService';
import { NetworkVMType } from '@avalabs/core-chains-sdk';
import { OnLock, OnUnlock } from '@src/background/runtime/lifecycleCallbacks';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { LedgerService } from '../ledger/LedgerService';
import { BaseWallet, Wallet, isHexString } from 'ethers';
import { Transaction } from 'bitcoinjs-lib';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
import ensureMessageIsValid from './utils/ensureMessageFormatIsValid';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { KeystoneService } from '../keystone/KeystoneService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';
import { WalletConnectSigner } from '../walletConnect/WalletConnectSigner';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { FireblocksBTCSigner } from '../fireblocks/FireblocksBTCSigner';
import { Action } from '../actions/models';
import { UnsignedTx } from '@avalabs/avalanchejs';
import { toUtf8 } from 'ethereumjs-util';
import { FireblocksService } from '../fireblocks/FireblocksService';
import { SecretsService } from '../secrets/SecretsService';
import { SecretType } from '../secrets/models';
import { FIREBLOCKS_REQUEST_EXPIRY } from '../fireblocks/models';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import { SeedlessSessionManager } from '../seedless/SeedlessSessionManager';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { Network } from '../network/models';
import { AccountsService } from '../accounts/AccountsService';
import { utils } from '@avalabs/avalanchejs';

@singleton()
export class WalletService implements OnLock, OnUnlock {
  private eventEmitter = new EventEmitter();
  private _wallets: WalletDetails[] = [];

  constructor(
    private networkService: NetworkService,
    private ledgerService: LedgerService,
    private keystoneService: KeystoneService,
    private walletConnectService: WalletConnectService,
    private fireblocksService: FireblocksService,
    private secretService: SecretsService,
    private accountsService: AccountsService
  ) {}

  public get wallets(): WalletDetails[] {
    return this._wallets;
  }

  private async emitWalletsInfo() {
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, this.wallets);
  }

  async onUnlock(): Promise<void> {
    const wallets = await this.secretService.getPrimaryWalletsDetails();

    if (!wallets.length) {
      return;
    }

    const hasUnsupportedSecret = wallets.some(
      ({ type }) => !SUPPORTED_PRIMARY_SECRET_TYPES.includes(type)
    );

    if (hasUnsupportedSecret) {
      throw new Error('Wallet initialization failed, no key found');
    }

    this._wallets = wallets;

    const hasSeedlessWallet = this._wallets.some(
      ({ type }) => type === SecretType.Seedless
    );

    if (hasSeedlessWallet) {
      // Refresh session on unlock
      const sessionManager = container.resolve(SeedlessSessionManager);
      sessionManager.refreshSession();
    }

    this.emitWalletsInfo();
  }

  /**
   * Called during the onboarding flow.
   * Responsible for saving the mnemonic/pubkey and activating the wallet.
   */
  async init(secrets: AddPrimaryWalletSecrets) {
    const walletId = await this.addPrimaryWallet(secrets);

    await this.onUnlock();
    return walletId;
  }

  onLock() {
    this._wallets = [];
    this.emitWalletsInfo();
  }

  async addPrimaryWallet(secrets: AddPrimaryWalletSecrets) {
    this.#validateSecretsType(secrets);
    const walletId = await this.secretService.addSecrets(secrets);
    this._wallets = await this.secretService.getPrimaryWalletsDetails();

    this.emitWalletsInfo();

    return walletId;
  }

  #validateSecretsType(secrets: AddPrimaryWalletSecrets) {
    if (secrets.secretType === SecretType.Mnemonic && !secrets.mnemonic) {
      throw new Error(
        'Mnemonic or xpub or pubKey is required to create a new wallet!'
      );
    }
    if (secrets.secretType === SecretType.LedgerLive && !secrets.pubKeys) {
      throw new Error('PubKey is required to create a new wallet!');
    }
    if (
      (secrets.secretType === SecretType.Keystone ||
        secrets.secretType === SecretType.Ledger) &&
      !secrets.xpub
    ) {
      throw new Error(
        'Mnemonic or xpub or pubKey is required to create a new wallet!'
      );
    }
    return true;
  }

  private async getWallet({
    network,
    tabId,
    accountIndex,
  }: {
    network: Network;
    tabId?: number;
    accountIndex?: number;
  }) {
    if (!this.accountsService.activeAccount) {
      return;
    }
    const secrets = await this.secretService.getActiveAccountSecrets(
      this.accountsService.activeAccount
    );
    if (!secrets.account) {
      // wallet is not initialized
      return;
    }

    const provider = getProviderForNetwork(network);
    const { secretType } = secrets;

    // Seedless wallet uses a universal signer class (one for all tx types)

    if (secretType === SecretType.Seedless) {
      const accountIndexToUse =
        accountIndex === undefined ? secrets.account.index : accountIndex;
      const addressPublicKey = secrets.pubKeys[accountIndexToUse];

      if (!addressPublicKey) {
        throw new Error('Account public key not available');
      }

      const wallet = new SeedlessWallet({
        networkService: this.networkService,
        sessionStorage: new SeedlessTokenStorage(this.secretService),
        addressPublicKey,
        network,
        sessionManager: container.resolve(SeedlessSessionManager),
      });
      return wallet;
    }

    // EVM signers
    if (network.vmName === NetworkVMType.EVM) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        const signer = getWalletFromMnemonic(
          secrets.mnemonic,
          accountIndexToUse,
          secrets.derivationPath
        );
        return signer.connect(provider as JsonRpcBatchInternal);
      }

      if (
        secretType === SecretType.Ledger ||
        secretType === SecretType.LedgerLive
      ) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        return new LedgerSigner(
          accountIndexToUse,
          this.ledgerService.recentTransport,
          secrets.derivationPath,
          provider as JsonRpcBatchInternal
        );
      }

      if (secretType === SecretType.Keystone) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return new KeystoneWallet(
          secrets.masterFingerprint,
          accountIndexToUse,
          this.keystoneService,
          network.chainId,
          tabId
        );
      }

      if (
        secretType === SecretType.Fireblocks ||
        secretType === SecretType.WalletConnect
      ) {
        return new WalletConnectSigner(
          this.walletConnectService,
          network.chainId,
          secrets.account.addressC,
          tabId,
          // Due to Fireblocks nature, transaction sign requests may need
          // more time than WalletConnect's default of 5 minutes.
          secretType === SecretType.Fireblocks
            ? FIREBLOCKS_REQUEST_EXPIRY
            : undefined
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new Wallet(secrets.secret, provider as JsonRpcBatchInternal);
      }

      throw new Error(
        `No proper signer could be constructed for EVM and ${secretType} account`
      );
    }

    // Bitcoin signers
    if (network.vmName === NetworkVMType.BITCOIN) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return await BitcoinWallet.fromMnemonic(
          secrets.mnemonic,
          accountIndexToUse,
          provider as BitcoinProviderAbstract
        );
      }
      if (secretType === SecretType.Fireblocks) {
        if (!secrets.api) {
          throw new Error(`Fireblocks API access keys not configured`);
        }

        return new FireblocksBTCSigner(
          this.fireblocksService,
          secrets.api.vaultAccountId,
          network.isTestnet
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new BitcoinWallet(
          Buffer.from(secrets.secret, 'hex'),
          provider as BitcoinProviderAbstract
        );
      }

      if (secretType === SecretType.Keystone) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return new BitcoinKeystoneWallet(
          secrets.masterFingerprint,
          getAddressPublicKeyFromXPub(secrets.xpub, accountIndexToUse),
          getAddressDerivationPath(
            accountIndexToUse,
            secrets.derivationPath,
            'EVM'
          ),
          this.keystoneService,
          provider as BitcoinProviderAbstract,
          tabId
        );
      }

      if (secretType === SecretType.Ledger) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails();
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        return new BitcoinLedgerWallet(
          getAddressPublicKeyFromXPub(secrets.xpub, accountIndexToUse),
          getAddressDerivationPath(
            accountIndexToUse,
            secrets.derivationPath,
            'EVM'
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      }

      if (secretType === SecretType.LedgerLive) {
        // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        const addressPublicKey = secrets.pubKeys[accountIndexToUse];

        if (!addressPublicKey) {
          throw new Error('Account public key not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails();

        return new BitcoinLedgerWallet(
          Buffer.from(addressPublicKey.evm, 'hex'),
          getAddressDerivationPath(
            accountIndexToUse,
            secrets.derivationPath,
            'EVM'
          ),
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy
        );
      }

      throw new Error(
        `No proper signer could be constructed for Bitcoin and ${secretType} account`
      );
    }

    // Avalanche signers
    if (
      network.vmName === NetworkVMType.AVM ||
      network.vmName === NetworkVMType.PVM
    ) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return new Avalanche.SimpleSigner(secrets.mnemonic, accountIndexToUse);
      }

      if (secretType === SecretType.Ledger) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        return new Avalanche.SimpleLedgerSigner(
          accountIndexToUse,
          provider as Avalanche.JsonRpcProvider,
          secrets.xpubXP
        );
      }

      if (secretType === SecretType.LedgerLive) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        const pubkey = secrets.pubKeys[accountIndexToUse];

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
            accountIndexToUse,
            DerivationPath.LedgerLive,
            'AVM'
          ),
          Buffer.from(pubkey.evm, 'hex'),
          getAddressDerivationPath(
            accountIndexToUse,
            DerivationPath.LedgerLive,
            'EVM'
          ),
          provider as Avalanche.JsonRpcProvider
        );
      }

      if (secretType === SecretType.WalletConnect) {
        return new WalletConnectSigner(
          this.walletConnectService,
          network.chainId,
          secrets.account.addressC,
          tabId
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new Avalanche.StaticSigner(
          Buffer.from(secrets.secret, 'hex'),
          Buffer.from(secrets.secret, 'hex'),
          provider as Avalanche.JsonRpcProvider
        );
      }

      throw new Error(
        `No proper signer could be constructed for Avalanche and ${secretType} account`
      );
    }
  }

  async sign(
    tx: SignTransactionRequest,
    network: Network,
    tabId?: number,
    originalRequestMethod?: string
  ): Promise<SigningResult> {
    const wallet = await this.getWallet({ network, tabId });

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
    if (!this.accountsService.activeAccount) {
      throw new Error('There is no active account');
    }
    const secrets = await this.secretService.getActiveAccountSecrets(
      this.accountsService.activeAccount
    );

    if (secrets.secretType === SecretType.Fireblocks) {
      // TODO: We technically can fetch some public keys using the API,
      // but is it feasible? What about WalletConnect? I don't think we
      // can fetch them via WalletConnect alone.
      throw new Error('Public key is not known for Fireblocks accounts');
    }

    if (secrets.secretType === SecretType.WalletConnect) {
      if (!secrets.pubKey) {
        throw new Error('This account does not have its public key imported');
      }

      return secrets.pubKey;
    }

    if (secrets.secretType === SecretType.PrivateKey) {
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

    if (secrets.secretType === SecretType.Mnemonic && secrets.account) {
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
      secrets.secretType === SecretType.Ledger &&
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
      (secrets.secretType === SecretType.LedgerLive ||
        secrets.secretType === SecretType.Seedless) &&
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
  private async signMessageAvalanche(params: MessageParams) {
    const message = toUtf8(params.data);
    const xpNetwork = this.networkService.getAvalancheNetworkXP();
    const wallet = await this.getWallet({
      network: xpNetwork,
      accountIndex: params.accountIndex,
    });

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
  async signMessage(messageType: MessageType, action: Action<SignMessageData>) {
    const network = await this.networkService.getNetwork(action.scope);

    if (!network) {
      throw new Error(`no active network found`);
    }

    const wallet = await this.getWallet({
      accountIndex: action.displayData.messageParams.accountIndex,
      network,
    });

    const data = action.displayData?.messageParams?.data;

    ensureMessageIsValid(messageType, data, network.chainId);

    if (wallet instanceof WalletConnectSigner) {
      return await wallet.signMessage(messageType, action.params);
    }

    if (wallet instanceof SeedlessWallet) {
      return wallet.signMessage(messageType, action.displayData?.messageParams);
    }

    if (wallet instanceof LedgerSigner) {
      if (
        [
          MessageType.SIGN_TYPED_DATA,
          MessageType.SIGN_TYPED_DATA_V1,
          MessageType.SIGN_TYPED_DATA_V3,
          MessageType.SIGN_TYPED_DATA_V4,
        ].includes(messageType)
      ) {
        return wallet.signTypedData(data.domain, data.types, data.message);
      } else if (
        [MessageType.ETH_SIGN, MessageType.PERSONAL_SIGN].includes(messageType)
      ) {
        const dataToSign = isHexString(data) ? utils.hexToBuffer(data) : data;

        return wallet.signMessage(dataToSign);
      } else {
        throw new Error(`this function is not supported on your wallet`);
      }
    }

    if (messageType === MessageType.AVALANCHE_SIGN) {
      return this.signMessageAvalanche(action.displayData?.messageParams);
    }

    if (!wallet || !(wallet instanceof BaseWallet)) {
      throw new Error(
        wallet
          ? `this function is not supported on your wallet`
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

  async getAddressesByIndices(
    indices: number[],
    chainAlias: 'X' | 'P',
    isChange: boolean
  ) {
    const provXP = await this.networkService.getAvalanceProviderXP();
    const secrets = await this.secretService.getPrimaryAccountSecrets(
      this.accountsService.activeAccount
    );

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

  private async parseWalletPolicyDetails() {
    const policyInfo = await this.secretService.getBtcWalletPolicyDetails(
      this.accountsService.activeAccount
    );

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
