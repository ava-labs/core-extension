import { UnsignedTx, utils } from '@avalabs/avalanchejs';
import { strip0x } from '@avalabs/core-utils-sdk';
import {
  Avalanche,
  BitcoinLedgerWallet,
  BitcoinProviderAbstract,
  BitcoinWallet,
  createWalletPolicy,
  getAddressDerivationPath,
  getPublicKeyFromPrivateKey,
  getWalletFromMnemonic,
  JsonRpcBatchInternal,
  LedgerSigner,
  SolanaLedgerSigner,
  SolanaProvider,
  SolanaSigner,
} from '@avalabs/core-wallets-sdk';
import { NetworkVMType } from '@avalabs/vm-module-types';
import {
  assertPresent,
  getProviderForNetwork,
  isPchainNetwork,
  isSolanaNetwork,
  isXchainNetwork,
  omitUndefined,
} from '@core/common';
import {
  Account,
  AccountWithSeedlessSecrets,
  Action,
  AddPrimaryWalletSecrets,
  CommonError,
  FIREBLOCKS_REQUEST_EXPIRY,
  isSolanaMsgRequest,
  isSolanaRequest,
  LedgerError,
  MessageParams,
  MessageType,
  Network,
  PubKeyType,
  SecretsError,
  SecretType,
  SigningResult,
  SignMessageData,
  SignTransactionRequest,
  SUPPORTED_PRIMARY_SECRET_TYPES,
  WalletDetails,
  WalletEvents,
} from '@core/types';
import {
  personalSign,
  signTypedData,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { ed25519 } from '@noble/curves/ed25519';
import { Transaction } from 'bitcoinjs-lib';
import { toUtf8 } from 'ethereumjs-util';
import {
  BaseWallet,
  HDNodeWallet,
  isHexString,
  TransactionRequest,
  Wallet,
} from 'ethers';
import { EventEmitter } from 'events';
import { container, singleton } from 'tsyringe';
import { OnUnlock } from '../../runtime/lifecycleCallbacks';
import { AccountsService } from '../accounts/AccountsService';
import { FireblocksBTCSigner } from '../fireblocks/FireblocksBTCSigner';
import { FireblocksService } from '../fireblocks/FireblocksService';
import { BitcoinKeystoneWallet } from '../keystone/BitcoinKeystoneWallet';
import { KeystoneService } from '../keystone/KeystoneService';
import { KeystoneWallet } from '../keystone/KeystoneWallet';
import { LedgerService } from '../ledger/LedgerService';
import { NetworkService } from '../network/NetworkService';
import { AddressResolver } from '../secrets/AddressResolver';
import { SecretsService } from '../secrets/SecretsService';
import {
  getExtendedPublicKeyFor,
  getPublicKeyFor,
  isPrimaryWalletSecrets,
} from '../secrets/utils';
import { SeedlessSessionManager } from '../seedless/SeedlessSessionManager';
import { SeedlessTokenStorage } from '../seedless/SeedlessTokenStorage';
import { SeedlessWallet } from '../seedless/SeedlessWallet';
import { WalletConnectService } from '../walletConnect/WalletConnectService';
import { WalletConnectSigner } from '../walletConnect/WalletConnectSigner';
import { HVMWallet } from './HVMWallet';
import ensureMessageIsValid from './utils/ensureMessageFormatIsValid';
import { prepareBtcTxForLedger } from './utils/prepareBtcTxForLedger';
@singleton()
export class WalletService implements OnUnlock {
  private eventEmitter = new EventEmitter();

  constructor(
    private networkService: NetworkService,
    private ledgerService: LedgerService,
    private keystoneService: KeystoneService,
    private walletConnectService: WalletConnectService,
    private fireblocksService: FireblocksService,
    private secretService: SecretsService,
    private accountsService: AccountsService,
    private addressResolver: AddressResolver,
  ) {}

  async emitsWalletsInfo(wallets: WalletDetails[]) {
    this.eventEmitter.emit(WalletEvents.WALLET_STATE_UPDATE, wallets);
  }

  async onUnlock(): Promise<void> {
    const wallets = await this.secretService.getPrimaryWalletsDetails();

    if (!wallets.length) {
      return;
    }

    const hasUnsupportedSecret = wallets.some(
      ({ type }) => !SUPPORTED_PRIMARY_SECRET_TYPES.includes(type),
    );

    if (hasUnsupportedSecret) {
      throw new Error('Wallet initialization failed, no key found');
    }

    const hasSeedlessWallet = wallets.some(
      ({ type }) => type === SecretType.Seedless,
    );

    if (hasSeedlessWallet) {
      // Refresh session on unlock
      const sessionManager = container.resolve(SeedlessSessionManager);
      sessionManager.refreshSession();
    }
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

  async addPrimaryWallet(secrets: AddPrimaryWalletSecrets) {
    this.#validateSecretsType(secrets);
    const walletId = await this.secretService.addSecrets(secrets);

    return walletId;
  }

  #validateSecretsType(secrets: AddPrimaryWalletSecrets) {
    if (secrets.secretType === SecretType.Mnemonic && !secrets.mnemonic) {
      throw new Error(
        'Mnemonic or xpub or pubKey is required to create a new wallet!',
      );
    }
    if (
      secrets.secretType === SecretType.LedgerLive &&
      !secrets.publicKeys?.length
    ) {
      throw new Error('PubKey is required to create a new wallet!');
    }
    if (
      (secrets.secretType === SecretType.Keystone ||
        secrets.secretType === SecretType.Keystone3Pro ||
        secrets.secretType === SecretType.Ledger) &&
      !secrets.extendedPublicKeys?.length
    ) {
      throw new Error(
        'Mnemonic or xpub or pubKey is required to create a new wallet!',
      );
    }
    return true;
  }

  async #getSeedlessWallet(
    secrets: AccountWithSeedlessSecrets,
    network: Network,
    accountIndex?: number,
  ) {
    const accountIndexToUse =
      accountIndex === undefined ? secrets.account.index : accountIndex;

    const vmName =
      isXchainNetwork(network) || isPchainNetwork(network)
        ? NetworkVMType.AVM
        : isSolanaNetwork(network)
          ? NetworkVMType.SVM
          : NetworkVMType.EVM; // Our Bitcoin implementation uses the EVM derivation path

    const curve = isSolanaNetwork(network) ? 'ed25519' : 'secp256k1';

    const derivationPaths = await this.addressResolver.getDerivationPathsByVM(
      accountIndexToUse,
      secrets.derivationPathSpec,
      [vmName],
    );

    const addressPublicKey = getPublicKeyFor(
      secrets,
      derivationPaths[vmName],
      curve,
    );

    if (!addressPublicKey) {
      throw new Error('Account public key not available');
    }

    return new SeedlessWallet({
      networkService: this.networkService,
      sessionStorage: new SeedlessTokenStorage(this.secretService),
      addressPublicKey,
      network,
      sessionManager: container.resolve(SeedlessSessionManager),
    });
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
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      return;
    }
    const secrets = await this.secretService.getAccountSecrets(activeAccount);
    if (!secrets.account) {
      // wallet is not initialized
      return;
    }
    const { secretType } = secrets;

    // Solana
    if (network.vmName === NetworkVMType.SVM) {
      switch (secretType) {
        case SecretType.Mnemonic:
          return SolanaSigner.fromMnemonic(
            secrets.mnemonic,
            secrets.account.index,
          );
        case SecretType.PrivateKey:
          return new SolanaSigner(Buffer.from(secrets.secret, 'hex'));
        case SecretType.Ledger:
        case SecretType.LedgerLive: {
          if (!this.ledgerService.recentTransport) {
            throw new Error('Ledger transport not available');
          }
          const accountIndexToUse =
            accountIndex === undefined ? secrets.account.index : accountIndex;

          return new SolanaLedgerSigner(
            accountIndexToUse,
            this.ledgerService.recentTransport,
          );
        }
        case SecretType.Seedless:
          return this.#getSeedlessWallet(secrets, network, accountIndex);
        default:
          throw new Error(
            `Unsupported wallet type for Solana transaction: ${secretType}`,
          );
      }
    }
    // HVM
    if (network.vmName === NetworkVMType.HVM) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return HVMWallet.fromMnemonic(
          secrets.mnemonic,
          accountIndexToUse,
          secrets.derivationPathSpec,
        );
      }
      if (secretType === SecretType.PrivateKey) {
        const { secret } = secrets;
        return new HVMWallet(secret);
      }
      throw new Error('Unsupported wallet types');
    }

    const provider = await getProviderForNetwork(network);

    // Seedless wallet uses a universal signer class (one for all tx types)

    if (secretType === SecretType.Seedless) {
      return this.#getSeedlessWallet(secrets, network, accountIndex);
    }

    // EVM signers
    if (network.vmName === NetworkVMType.EVM) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        const signer = getWalletFromMnemonic(
          secrets.mnemonic,
          accountIndexToUse,
          secrets.derivationPathSpec,
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
          secrets.derivationPathSpec,
          provider as JsonRpcBatchInternal,
        );
      }

      if (
        secretType === SecretType.Keystone ||
        secretType === SecretType.Keystone3Pro
      ) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        const derivationPathEVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'EVM',
        );
        const derivationPathAVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'AVM',
        );
        const evmExtendedPubKey = getExtendedPublicKeyFor(
          secrets.extendedPublicKeys,
          derivationPathEVM,
          'secp256k1',
        );
        const avmExtendedPubKey = getExtendedPublicKeyFor(
          secrets.extendedPublicKeys,
          derivationPathAVM,
          'secp256k1',
        );

        assertPresent(evmExtendedPubKey, SecretsError.PublicKeyNotFound);

        return new KeystoneWallet(
          secrets.masterFingerprint,
          accountIndexToUse,
          this.keystoneService,
          network.chainId,
          tabId,
          evmExtendedPubKey.key,
          avmExtendedPubKey ? avmExtendedPubKey.key : undefined,
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
            : undefined,
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new Wallet(secrets.secret, provider as JsonRpcBatchInternal);
      }

      throw new Error(
        `No proper signer could be constructed for EVM and ${secretType} account`,
      );
    }

    // Bitcoin signers
    if (network.vmName === NetworkVMType.BITCOIN) {
      if (secretType === SecretType.Fireblocks) {
        if (!secrets.api) {
          throw new Error(`Fireblocks API access keys not configured`);
        }

        return new FireblocksBTCSigner(
          this.fireblocksService,
          secrets.api.vaultAccountId,
          network.isTestnet,
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new BitcoinWallet(
          Buffer.from(secrets.secret, 'hex'),
          provider as BitcoinProviderAbstract,
        );
      }

      if (!isPrimaryWalletSecrets(secrets)) {
        throw new Error(
          `No proper signer could be constructed for Bitcoin and ${secretType} account`,
        );
      }

      const accountIndexToUse =
        accountIndex === undefined ? secrets.account.index : accountIndex;

      if (secretType === SecretType.Mnemonic) {
        return await BitcoinWallet.fromMnemonic(
          secrets.mnemonic,
          accountIndexToUse,
          provider as BitcoinProviderAbstract,
        );
      }

      const derivationPath = getAddressDerivationPath(
        accountIndexToUse,
        secrets.derivationPathSpec,
        'EVM',
      );
      const publicKey = getPublicKeyFor(secrets, derivationPath, 'secp256k1');

      assertPresent(publicKey, SecretsError.PublicKeyNotFound);

      if (
        secretType === SecretType.Keystone ||
        secretType === SecretType.Keystone3Pro
      ) {
        return new BitcoinKeystoneWallet(
          secrets.masterFingerprint,
          Buffer.from(publicKey.key, 'hex'),
          derivationPath,
          this.keystoneService,
          provider as BitcoinProviderAbstract,
          tabId,
          secretType === SecretType.Keystone3Pro,
        );
      }

      if (secretType === SecretType.Ledger) {
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }

        const walletPolicy = await this.parseWalletPolicyDetails(
          secrets.account,
        );

        return new BitcoinLedgerWallet(
          Buffer.from(publicKey.key, 'hex'),
          derivationPath,
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy,
        );
      }

      if (secretType === SecretType.LedgerLive) {
        // Use LedgerLive derivation paths for address public keys (m/44'/60'/n'/0/0) in storage
        if (!this.ledgerService.recentTransport) {
          throw new Error('Ledger transport not available');
        }
        const walletPolicy = await this.parseWalletPolicyDetails(
          secrets.account,
        );

        return new BitcoinLedgerWallet(
          Buffer.from(publicKey.key, 'hex'),
          derivationPath,
          provider as BitcoinProviderAbstract,
          this.ledgerService.recentTransport,
          walletPolicy,
        );
      }
    }

    // Avalanche signers
    if (
      network.vmName === NetworkVMType.AVM ||
      network.vmName === NetworkVMType.PVM ||
      network.vmName === NetworkVMType.CoreEth
    ) {
      if (secretType === SecretType.Mnemonic) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        return new Avalanche.SimpleSigner(secrets.mnemonic, accountIndexToUse);
      }

      if (secretType === SecretType.Ledger) {
        assertPresent(
          this.ledgerService.recentTransport,
          LedgerError.TransportNotFound,
        );

        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        const derivationPath = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'AVM',
        );
        const extPublicKey = getExtendedPublicKeyFor(
          secrets.extendedPublicKeys,
          derivationPath,
          'secp256k1',
        );

        assertPresent(extPublicKey, SecretsError.MissingExtendedPublicKey);

        return new Avalanche.SimpleLedgerSigner(
          accountIndexToUse,
          provider as Avalanche.JsonRpcProvider,
          extPublicKey.key,
        );
      }

      if (secretType === SecretType.LedgerLive) {
        assertPresent(
          this.ledgerService.recentTransport,
          LedgerError.TransportNotFound,
        );
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;
        const derivationPathEVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'EVM',
        );
        const derivationPathAVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'AVM',
        );
        const pubkeyEVM = getPublicKeyFor(
          secrets,
          derivationPathEVM,
          'secp256k1',
        );
        const pubkeyAVM = getPublicKeyFor(
          secrets,
          derivationPathAVM,
          'secp256k1',
        );

        assertPresent(pubkeyEVM, SecretsError.PublicKeyNotFound);
        assertPresent(pubkeyAVM, SecretsError.PublicKeyNotFound);

        // TODO: SimpleLedgerSigner doesn't support LedgerLive derivation paths ATM
        // https://ava-labs.atlassian.net/browse/CP-5861
        return new Avalanche.LedgerSigner(
          Buffer.from(pubkeyAVM.key, 'hex'),
          derivationPathAVM,
          Buffer.from(pubkeyEVM.key, 'hex'),
          derivationPathEVM,
          provider as Avalanche.JsonRpcProvider,
        );
      }

      if (
        secretType === SecretType.Keystone ||
        secretType === SecretType.Keystone3Pro
      ) {
        const accountIndexToUse =
          accountIndex === undefined ? secrets.account.index : accountIndex;

        const derivationPathEVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'EVM',
        );
        const derivationPathAVM = getAddressDerivationPath(
          accountIndexToUse,
          secrets.derivationPathSpec,
          'AVM',
        );
        const evmExtendedPubKey = getExtendedPublicKeyFor(
          secrets.extendedPublicKeys,
          derivationPathEVM,
          'secp256k1',
        );
        const avmExtendedPubKey = getExtendedPublicKeyFor(
          secrets.extendedPublicKeys,
          derivationPathAVM,
          'secp256k1',
        );

        assertPresent(evmExtendedPubKey, SecretsError.PublicKeyNotFound);
        if (secretType === SecretType.Keystone3Pro) {
          assertPresent(avmExtendedPubKey, SecretsError.PublicKeyNotFound);
        }

        return new KeystoneWallet(
          secrets.masterFingerprint,
          accountIndexToUse,
          this.keystoneService,
          network.chainId,
          tabId,
          evmExtendedPubKey.key,
          avmExtendedPubKey ? avmExtendedPubKey.key : undefined,
        );
      }

      if (secretType === SecretType.WalletConnect) {
        return new WalletConnectSigner(
          this.walletConnectService,
          network.chainId,
          secrets.account.addressC,
          tabId,
        );
      }

      if (secretType === SecretType.PrivateKey) {
        return new Avalanche.StaticSigner(
          Buffer.from(secrets.secret, 'hex'),
          Buffer.from(secrets.secret, 'hex'),
          provider as Avalanche.JsonRpcProvider,
        );
      }

      throw new Error(
        `No proper signer could be constructed for Avalanche and ${secretType} account`,
      );
    }
  }

  async signTransactionBatch(
    batch: TransactionRequest[],
    network: Network,
    tabId?: number,
  ) {
    const wallet = await this.getWallet({ network, tabId });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Only wallets that provide us signed transactions without additional approvals
    // can be used to sign transaction batches (so for example hardware wallets or accounts
    // that connect through WalletConnect protocol would not work, since users have to approve
    // each transaction one by one anyways.
    const isSeedless = wallet instanceof SeedlessWallet;
    const isSeedphrase = wallet instanceof HDNodeWallet;
    const isPrivateKey = wallet instanceof Wallet;

    if (!isSeedless && !isSeedphrase && !isPrivateKey) {
      throw new Error('The active wallet does not support batch transactions');
    }

    return Promise.all(
      batch.map(async (tx) => ({
        signedTx: await wallet.signTransaction(tx),
      })),
    );
  }

  async sign(
    tx: SignTransactionRequest,
    network: Network,
    tabId?: number,
    originalRequestMethod?: string,
  ): Promise<SigningResult> {
    const wallet = await this.getWallet({
      network,
      tabId,
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    if (isSolanaRequest(tx)) {
      if (
        !(wallet instanceof SolanaSigner) &&
        !(wallet instanceof SolanaLedgerSigner) &&
        !(wallet instanceof SeedlessWallet)
      ) {
        throw new Error('Unable to find a proper signer');
      }

      if (isSolanaMsgRequest(tx)) {
        if (!(wallet instanceof SolanaSigner)) {
          /**
           * FIXME:
           * I have a PoC that seems to be working, but obtained signatures are not verified
           * properly by the dApps. I think it's because the dApps provide a UTF-8 message,
           * but for it to be accepted by Solana Ledger app, we need to serialize it,
           * add a message header etc., and I think Ledger then signs the whole thing, which
           * makes it impossible to verify the signature with the original message.
           */
          throw new Error(
            'Signing off-chain messages is only supported with seedphrase wallets at the moment',
          );
        }

        return {
          signedTx: await wallet.signMessage(tx.data),
        };
      }

      const provider = (await getProviderForNetwork(network)) as SolanaProvider;

      if (wallet instanceof SeedlessWallet) {
        return {
          signedTx: await wallet.signSolanaTx(tx.data, provider),
        };
      }

      return {
        signedTx: await wallet.signTx(tx.data, provider),
      };
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
              await this.networkService.getBitcoinProvider(),
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
        !(wallet instanceof KeystoneWallet) &&
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

    if ('abi' in tx) {
      if (!(wallet instanceof HVMWallet)) {
        throw new Error('ed25519 is not supported');
      }
      return this.#normalizeSigningResult(
        await wallet.signEd25519(tx.txPayload, tx.abi),
      );
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
    signingResult: string | UnsignedTx | Transaction | SigningResult,
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
    const activeAccount = await this.accountsService.getActiveAccount();
    if (!activeAccount) {
      throw new Error('There is no active account');
    }
    const secrets = await this.secretService.getAccountSecrets(activeAccount);

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
          'Cannot find public key for the given imported account',
        );
      }

      const publicKey = getPublicKeyFromPrivateKey(secrets.secret).toString(
        'hex',
      );

      return {
        evm: publicKey,
        xp: publicKey,
        ed25519: Buffer.from(
          ed25519.getPublicKey(strip0x(secrets.secret)),
        ).toString('hex'),
      };
    }

    assertPresent(secrets.account, CommonError.NoActiveAccount);

    const derivationPathEVM = getAddressDerivationPath(
      secrets.account.index,
      secrets.derivationPathSpec,
      'EVM',
    );
    const derivationPathAVM = getAddressDerivationPath(
      secrets.account.index,
      secrets.derivationPathSpec,
      'AVM',
    );

    const evmPub = getPublicKeyFor(secrets, derivationPathEVM, 'secp256k1');
    const avmPub = getPublicKeyFor(secrets, derivationPathAVM, 'secp256k1');
    const hvmPub = getPublicKeyFor(secrets, derivationPathAVM, 'ed25519');

    assertPresent(
      evmPub,
      SecretsError.PublicKeyNotFound,
      `EVM @ ${derivationPathEVM}`,
    );

    return omitUndefined({
      evm: evmPub?.key,
      xp: avmPub?.key,
      ed25519: hvmPub?.key,
      svm: secrets.account.addressSVM,
    });
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

    if (
      wallet instanceof Avalanche.SimpleLedgerSigner ||
      wallet instanceof Avalanche.LedgerSigner
    ) {
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

    if (wallet instanceof KeystoneWallet) {
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
          : 'wallet undefined in sign tx',
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
    isChange: boolean,
  ) {
    const provXP = await this.networkService.getAvalanceProviderXP();
    const activeAccount = await this.accountsService.getActiveAccount();
    const secrets =
      await this.secretService.getPrimaryAccountSecrets(activeAccount);

    if (!secrets || !('extendedPublicKeys' in secrets)) {
      return [];
    }

    if (isChange && chainAlias !== 'X') {
      return [];
    }

    return indices.map((index) => {
      const avmDerivationPath = getAddressDerivationPath(
        index,
        secrets.derivationPathSpec,
        'AVM',
      );
      const avmExtendedPubKey = getExtendedPublicKeyFor(
        secrets.extendedPublicKeys,
        avmDerivationPath,
        'secp256k1',
      );

      assertPresent(
        avmExtendedPubKey,
        SecretsError.MissingExtendedPublicKey,
        `AVM @ ${avmDerivationPath}`,
      );

      return Avalanche.getAddressFromXpub(
        avmExtendedPubKey.key,
        index,
        provXP,
        chainAlias,
        isChange,
      );
    });
  }

  private async parseWalletPolicyDetails(account: Account) {
    const policyInfo =
      await this.secretService.getBtcWalletPolicyDetails(account);

    if (!policyInfo || !policyInfo.details) {
      throw new Error('Error while parsing wallet policy: missing data.');
    }

    const { accountIndex, details } = policyInfo;
    const hmac = Buffer.from(details.hmacHex, 'hex');
    const policy = createWalletPolicy(
      details.masterFingerprint,
      accountIndex,
      details.xpub,
      details.name,
    );

    return {
      hmac,
      policy,
    };
  }
}
