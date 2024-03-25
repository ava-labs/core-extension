import * as cs from '@cubist-labs/cubesigner-sdk';
import { Signer } from '@cubist-labs/cubesigner-sdk-ethers-v6';
import { strip0x } from '@avalabs/utils-sdk';
import { Network } from '@avalabs/chains-sdk';
import {
  JsonRpcApiProvider,
  TransactionRequest,
  getBytes,
  hashMessage,
  BytesLike,
} from 'ethers';
import {
  Avalanche,
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  BlockCypherProvider,
  createPsbt,
  getEvmAddressFromPubKey,
} from '@avalabs/wallets-sdk';
import { sha256 } from '@noble/hashes/sha256';
import { hexToBuffer } from '@avalabs/avalanchejs-v2';
import {
  SignTypedDataVersion,
  TypedDataUtils,
  typedSignatureHash,
} from '@metamask/eth-sig-util';

import { NetworkService } from '../network/NetworkService';
import { PubKeyType } from '../wallet/models';
import { MessageParams, MessageType } from '../messages/models';
import { SeedlessBtcSigner } from './SeedlessBtcSigner';
import { Transaction } from 'bitcoinjs-lib';
import { isBitcoinNetwork } from '../network/utils/isBitcoinNetwork';
import { CoreApiError } from './models';
import { SeedlessSessionManager } from './SeedlessSessionManager';
import { isTokenExpiredError } from './utils';
import { SeedlessMfaService } from './SeedlessMfaService';
import { toUtf8 } from 'ethereumjs-util';

type ConstructorOpts = {
  networkService: NetworkService;
  sessionStorage: cs.SessionStorage<cs.SignerSessionData>;
  addressPublicKey?: PubKeyType;
  network?: Network;
  sessionManager?: SeedlessSessionManager;
  mfaService?: SeedlessMfaService;
};

export class SeedlessWallet {
  #networkService: NetworkService;
  #sessionStorage: cs.SessionStorage<cs.SignerSessionData>;
  #addressPublicKey?: PubKeyType;
  #network?: Network;
  #sessionManager?: SeedlessSessionManager;
  #signerSession?: cs.SignerSession;
  #mfaService?: SeedlessMfaService;

  constructor({
    networkService,
    sessionStorage,
    addressPublicKey,
    network,
    sessionManager,
    mfaService,
  }: ConstructorOpts) {
    this.#networkService = networkService;
    this.#sessionStorage = sessionStorage;
    this.#addressPublicKey = addressPublicKey;
    this.#network = network;
    this.#sessionManager = sessionManager;
    this.#mfaService = mfaService;
  }

  get #connected() {
    return Boolean(this.#signerSession);
  }

  async #connect() {
    if (this.#connected) {
      return;
    }

    this.#signerSession = await cs.SignerSession.loadSignerSession(
      this.#sessionStorage
    );
  }

  async addAccount(accountIndex) {
    if (accountIndex < 1) {
      // To add a new account this way, we first need to know at least one
      // public key -- to be able to finx the mnemonic ID that we'll use
      // to derive the next keys.
      // To derive the first (0-index) key, /register endpoint should be used.
      throw new Error('Account index must be greater than or equal to 1');
    }

    const session = await this.#getSession();
    const identityProof = await session.proveIdentity();
    const mnemonicId = await this.#getMnemonicId();

    try {
      const response = await fetch(
        process.env.SEEDLESS_URL + '/v1/addAccount',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountIndex,
            identityProof,
            mnemonicId,
          }),
        }
      );

      if (!response.ok) {
        throw new CoreApiError('Adding new account failed');
      }
    } catch (err) {
      // Rethrow known errors
      if (err instanceof CoreApiError) {
        throw err;
      }

      throw new Error('Core Seedless API is unreachable');
    }
  }

  async #getMnemonicId(withPrefix = false): Promise<string> {
    if (!this.#addressPublicKey) {
      throw new Error('Public key not available');
    }

    const session = await this.#getSession();

    try {
      const keys = await session.keys();

      const activeAccountKey = keys.find(
        (key) => strip0x(key.publicKey) === this.#addressPublicKey?.evm
      );

      const mnemonicId = activeAccountKey?.derivation_info?.mnemonic_id;

      if (!mnemonicId) {
        throw new Error('Cannot establish the mnemonic id');
      }

      return withPrefix ? `Key#Mnemonic_${mnemonicId}` : mnemonicId;
    } catch (err) {
      this.#handleError(err);
    }
  }

  async #getSession(): Promise<cs.SignerSession> {
    await this.#connect();

    if (!this.#signerSession) {
      throw new Error('SeedlessWallet not connected');
    }

    return this.#signerSession;
  }

  async getMnemonicExportState(): Promise<
    cs.UserExportInitResponse | undefined
  > {
    const session = await this.#getSession();
    const paginator = session.userExportList();

    const [request] = await paginator.fetchAll();

    return request;
  }

  async initMnemonicExport(tabId?: number): Promise<cs.UserExportInitResponse> {
    if (!this.#mfaService) {
      throw new Error('MFA Service is not available');
    }

    const session = await this.#getSession();
    const mnemonicId = await this.#getMnemonicId(true);

    const initRequest = await session.userExportInit(mnemonicId);

    if (!initRequest.requiresMfa()) {
      await session.userExportDelete(mnemonicId);
      throw new Error('Expected MFA to be required');
    }

    const method = await this.#mfaService.askForMfaMethod({
      mfaId: initRequest.mfaId(),
      tabId,
    });

    if (!method) {
      throw new Error('No MFA method was chosen');
    }

    const result = await this.#mfaService.approveWithMfa(
      method?.type,
      initRequest,
      tabId
    );

    return result.data();
  }

  async cancelMnemonicExport(): Promise<void> {
    const session = await this.#getSession();
    const mnemonicId = await this.#getMnemonicId(true);

    await session.userExportDelete(mnemonicId);
  }

  async completeMnemonicExport(
    publicKey: CryptoKey,
    tabId?: number
  ): Promise<cs.UserExportCompleteResponse> {
    if (!this.#mfaService) {
      throw new Error('MFA Service is not available');
    }

    const session = await this.#getSession();
    const mnemonicId = await this.#getMnemonicId(true);

    const request = await session.userExportComplete(mnemonicId, publicKey);

    if (!request.requiresMfa()) {
      throw new Error('Expected MFA to be required');
    }

    const method = await this.#mfaService.askForMfaMethod({
      mfaId: request.mfaId(),
      tabId,
    });

    if (!method) {
      throw new Error('No MFA method was chosen');
    }

    const result = await this.#mfaService.approveWithMfa(
      method?.type,
      request,
      tabId
    );

    return result.data();
  }

  async getPublicKeys(): Promise<PubKeyType[]> {
    const session = await this.#getSession();
    // get keys and filter out non derived ones and group them
    let rawKeys: cs.KeyInfo[];

    try {
      rawKeys = await session.keys();
    } catch (err) {
      this.#handleError(err);
    }

    const requiredKeyTypes: cs.KeyTypeApi[] = ['SecpEthAddr', 'SecpAvaAddr'];
    const keys = rawKeys
      ?.filter(
        (k) =>
          k.enabled &&
          requiredKeyTypes.includes(k.key_type) &&
          k.derivation_info?.derivation_path
      )
      .reduce((acc, key) => {
        if (!key.derivation_info) {
          return acc;
        }

        const index = Number(
          key.derivation_info.derivation_path.split('/').pop()
        );
        if (index === undefined) {
          return acc;
        }

        acc[key.derivation_info.mnemonic_id] = [
          ...(acc[key.derivation_info.mnemonic_id] ?? []),
        ];
        const mnemonicBlock = acc[key.derivation_info.mnemonic_id] || [];

        mnemonicBlock[index] = {
          ...acc[key.derivation_info.mnemonic_id]?.[index],
          [key.key_type]: key,
        };

        return acc;
      }, {} as Record<string, Record<string, cs.KeyInfo>[]>);

    if (!keys || Object.keys(keys).length === 0) {
      throw new Error('Accounts not created');
    }

    const allDerivedKeySets = Object.values(keys);

    // We only look for key sets that contain all of the required key types.
    const validKeySets = allDerivedKeySets.filter((keySet) => {
      return keySet.every((key) => requiredKeyTypes.every((type) => key[type]));
    });

    if (!validKeySets[0]) {
      throw new Error('Accounts keys missing');
    }

    // If there are multiple valid sets, we choose the first one.
    const derivedKeys = validKeySets[0];
    const pubkeys = [] as PubKeyType[];

    derivedKeys.forEach((key) => {
      if (!key || !key['SecpAvaAddr'] || !key['SecpEthAddr']) {
        return;
      }

      pubkeys.push({
        evm: strip0x(key['SecpEthAddr'].public_key),
        xp: strip0x(key['SecpAvaAddr'].public_key),
      });
    });

    if (!pubkeys?.length) {
      throw new Error('Address not found');
    }

    return pubkeys;
  }

  async #getSigningKey(
    type: cs.Secp256k1,
    lookupPublicKey?: string
  ): Promise<cs.KeyInfo> {
    if (!lookupPublicKey) {
      throw new Error('Public key not available');
    }

    try {
      const session = await this.#getSession();
      const keys = await session.keys();
      // TODO: Cubist should provide filtering by key_type
      const key = keys
        .filter(({ key_type }) => key_type === type)
        .find(({ publicKey }) => strip0x(publicKey) === lookupPublicKey);

      if (!key) {
        throw new Error('Signing key not found');
      }

      return key;
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.#addressPublicKey || !this.#addressPublicKey.evm) {
      throw new Error('Public key not available');
    }

    if (!this.#network) {
      throw new Error('Unknown network');
    }

    const provider = this.#networkService.getProviderForNetwork(this.#network);
    if (!(provider instanceof JsonRpcApiProvider)) {
      throw new Error('Wrong provider obtained for EVM transaction');
    }

    try {
      const signer = new Signer(
        getEvmAddressFromPubKey(Buffer.from(this.#addressPublicKey.evm, 'hex')),
        await this.#getSession(),
        provider
      );
      // We need to await the signing call here so the errors can be
      // caught by catch clause.
      return await signer.signTransaction(transaction);
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signAvalancheTx(
    request: Avalanche.SignTxRequest
  ): Promise<Avalanche.SignTxRequest['tx']> {
    if (!this.#addressPublicKey) {
      throw new Error('Public key not available');
    }

    const isEvmTx = request.tx.getVM() === 'EVM';
    const isMainnet = this.#networkService.isMainnet();
    const session = await this.#getSession();
    const key = isEvmTx
      ? await this.#getSigningKey(cs.Secp256k1.Evm, this.#addressPublicKey.evm)
      : await this.#getSigningKey(
          isMainnet ? cs.Secp256k1.Ava : cs.Secp256k1.AvaTest,
          this.#addressPublicKey.xp
        );

    try {
      const response = await session.signBlob(key.key_id, {
        message_base64: Buffer.from(sha256(request.tx.toBytes())).toString(
          'base64'
        ),
      });

      request.tx.addSignature(hexToBuffer(response.data().signature));

      return request.tx;
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signTx(
    ins: BitcoinInputUTXO[],
    outs: BitcoinOutputUTXO[]
  ): Promise<Transaction> {
    if (!this.#network || !isBitcoinNetwork(this.#network)) {
      throw new Error(
        'Invalid network: Attempting to sign BTC transaction on non Bitcoin network'
      );
    }

    const provider = this.#networkService.getProviderForNetwork(this.#network);

    if (!(provider instanceof BlockCypherProvider)) {
      throw new Error('Wrong provider obtained for BTC transaction');
    }

    const btcNetwork = provider.getNetwork();
    const psbt = createPsbt(ins, outs, btcNetwork);
    const session = await this.#getSession();

    try {
      await Promise.all(
        psbt.txInputs.map((_, i) => {
          if (!this.#addressPublicKey) {
            throw new Error('Public key not available');
          }

          const signer = new SeedlessBtcSigner(
            this.#addressPublicKey.evm,
            psbt,
            i,
            ins,
            btcNetwork,
            session
          );
          return psbt.signInputAsync(i, signer);
        })
      );
    } catch (err) {
      this.#handleError(err);
    }

    // Validate inputs
    psbt.validateSignaturesOfAllInputs();
    // Finalize inputs
    psbt.finalizeAllInputs();
    return psbt.extractTransaction();
  }

  async signMessage(
    messageType: MessageType,
    messageParams: MessageParams
  ): Promise<string | Buffer> {
    if (!this.#addressPublicKey) {
      throw new Error('Public key not available');
    }

    if (!this.#network) {
      throw new Error('Network not available');
    }

    if (messageType === MessageType.AVALANCHE_SIGN) {
      if (!this.#addressPublicKey.xp) {
        throw new Error('X/P public key not available');
      }

      const xpProvider = await this.#networkService.getAvalanceProviderXP();
      const addressAVM = await xpProvider
        .getAddress(Buffer.from(this.#addressPublicKey.xp, 'hex'), 'X')
        .slice(2); // remove chain prefix
      const message = toUtf8(messageParams.data);

      return Buffer.from(
        strip0x(
          await this.#signBlob(
            addressAVM,
            `0x${Avalanche.digestMessage(message).toString('hex')}`
          )
        ),
        'hex'
      );
    }

    const addressEVM = getEvmAddressFromPubKey(
      Buffer.from(this.#addressPublicKey.evm, 'hex')
    ).toLowerCase();

    switch (messageType) {
      case MessageType.ETH_SIGN:
      case MessageType.PERSONAL_SIGN:
        return this.#signBlob(
          addressEVM,
          hashMessage(
            Uint8Array.from(Buffer.from(strip0x(messageParams.data), 'hex'))
          )
        );
      case MessageType.SIGN_TYPED_DATA:
      case MessageType.SIGN_TYPED_DATA_V1:
        return this.#signBlob(
          addressEVM,
          typedSignatureHash(messageParams.data)
        );
      case MessageType.SIGN_TYPED_DATA_V3:
      case MessageType.SIGN_TYPED_DATA_V4: {
        // Not using cs.ethers.Signer.signTypedData due to the strict type verification in Ethers
        // dApps in many cases have requests with extra unused types. In these cases ethers throws an error, rightfully.
        // However since MM supports these malformed messages, we have to as well. Otherwise Core would look broken.
        const hash = TypedDataUtils.eip712Hash(
          messageParams.data,
          messageType == MessageType.SIGN_TYPED_DATA_V3
            ? SignTypedDataVersion.V3
            : SignTypedDataVersion.V4
        ).toString('hex');
        return this.#signBlob(addressEVM, `0x${hash}`);
      }

      default:
        throw new Error('Unknown message type method');
    }
  }

  async #signBlob(address: string, digest: BytesLike): Promise<string> {
    const session = await this.#getSession();

    const blobReq = {
      message_base64: Buffer.from(getBytes(digest)).toString('base64'),
    };

    try {
      // Get the key corresponding to this address
      const keys = await session.keys();
      const key = keys.find((k) => k.material_id === address);
      if (key === undefined) {
        throw new Error(`Cannot access key '${address}'`);
      }
      const res = await session.signBlob(key.key_id, blobReq);
      return res.data().signature;
    } catch (err) {
      this.#handleError(err);
    }
  }

  #handleError(err): never {
    if (isTokenExpiredError(err)) {
      this.#sessionManager?.notifyTokenExpired();

      // Prevent leaking user information outside of extension
      // (original error message contains the user id).
      err.message = 'Session has expired';
    }

    throw err;
  }
}
