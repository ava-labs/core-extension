import { utils } from '@avalabs/avalanchejs';
import { strip0x } from '@avalabs/core-utils-sdk';
import {
  Avalanche,
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  BitcoinProvider,
  compileSolanaTx,
  createPsbt,
  deserializeTransactionMessage,
  getEvmAddressFromPubKey,
  serializeSolanaTx,
  SolanaProvider,
} from '@avalabs/core-wallets-sdk';
import * as cs from '@cubist-labs/cubesigner-sdk';
import { Signer } from '@cubist-labs/cubesigner-sdk-ethers-v6';
import {
  SignTypedDataVersion,
  TypedDataUtils,
  typedSignatureHash,
} from '@metamask/eth-sig-util';
import { sha256 } from '@noble/hashes/sha256';
import {
  BytesLike,
  getBytes,
  JsonRpcApiProvider,
  TransactionRequest,
} from 'ethers';

import {
  assertPresent,
  getAddressIndexFromPath,
  getProviderForNetwork,
  hasAtLeastOneElement,
  isBitcoinNetwork,
  isTokenExpiredError,
} from '@core/common';
import {
  AddressPublicKeyJson,
  CommonError,
  CoreApiError,
  MessageParams,
  MessageType,
  Network,
} from '@core/types';
import { base64, hex } from '@scure/base';
import { Transaction } from 'bitcoinjs-lib';
import { toUtf8 } from 'ethereumjs-util';
import { NetworkService } from '../network/NetworkService';
import { SeedlessBtcSigner } from './SeedlessBtcSigner';
import { SeedlessMfaService } from './SeedlessMfaService';
import { SeedlessSessionManager } from './SeedlessSessionManager';
import {
  isValidKeySet,
  seedlessKeyTypeToCurve,
  seedlessKeyTypeToNetworkVM,
} from './utils';
import { AddressPublicKey } from '../secrets/AddressPublicKey';
import { isValidPublicKey } from './utils/isValidPublicKey';
import { KeySet, KeySetDictionary, MnemonicAccountDictionary } from './types';

type ConstructorOpts = {
  networkService?: NetworkService;
  sessionStorage: cs.SessionStorage<cs.SignerSessionData>;
  addressPublicKeys?: AddressPublicKeyJson[];
  network?: Network;
  sessionManager?: SeedlessSessionManager;
  mfaService?: SeedlessMfaService;
};

export class SeedlessWallet {
  #sessionStorage: cs.SessionStorage<cs.SignerSessionData>;
  #networkService?: NetworkService;
  #addressPublicKeys?: [AddressPublicKeyJson, ...AddressPublicKeyJson[]];
  #network?: Network;
  #sessionManager?: SeedlessSessionManager;
  #signerSession?: cs.SignerSession;
  #mfaService?: SeedlessMfaService;

  constructor({
    networkService,
    sessionStorage,
    addressPublicKeys,
    network,
    sessionManager,
    mfaService,
  }: ConstructorOpts) {
    this.#networkService = networkService;
    this.#sessionStorage = sessionStorage;
    this.#network = network;
    this.#sessionManager = sessionManager;
    this.#mfaService = mfaService;

    if (!addressPublicKeys || hasAtLeastOneElement(addressPublicKeys)) {
      this.#addressPublicKeys = addressPublicKeys;
    } else {
      throw new Error('Address public keys not available');
    }
  }

  get #firstAddressPublicKey() {
    return this.#addressPublicKeys?.[0];
  }

  get #connected() {
    return Boolean(this.#signerSession);
  }

  async #connect() {
    if (this.#connected) {
      return;
    }

    this.#signerSession = await cs.SignerSession.loadSignerSession(
      this.#sessionStorage,
    );
  }

  async addAccount(accountIndex: number) {
    if (accountIndex < 1) {
      // To add a new account this way, we first need to know at least one
      // public key -- to be able to finx the mnemonic ID that we'll use
      // to derive the next keys.
      // To derive the first (0-index) key, /register endpoint should be used.
      throw new Error('Account index must be greater than or equal to 1');
    }

    return this.#mutateSeedlessAccount('addAccount', { accountIndex });
  }

  async #getMnemonicId(withPrefix = false): Promise<string> {
    if (!this.#firstAddressPublicKey) {
      throw new Error('Public key not available');
    }

    const session = await this.#getSession();

    try {
      const keys = await session.keys();

      const activeAccountKey = keys.find(
        (key) => strip0x(key.publicKey) === this.#firstAddressPublicKey?.key,
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
      tabId,
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
    tabId?: number,
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
      tabId,
    );

    return result.data();
  }

  async #mutateSeedlessAccount(
    endpoint: 'addAccount',
    params: { accountIndex: number },
  );
  async #mutateSeedlessAccount(endpoint: 'deriveMissingKeys', params?: never);
  async #mutateSeedlessAccount(
    endpoint: 'addAccount' | 'deriveMissingKeys',
    params?: object,
  ) {
    const session = await this.#getSession();
    const identityProof = await session.proveIdentity();
    const mnemonicId = await this.#getMnemonicId();

    try {
      const response = await fetch(
        process.env.SEEDLESS_URL + '/v1/' + endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identityProof,
            mnemonicId,
            ...params,
          }),
        },
      );

      if (!response.ok) {
        throw new CoreApiError(`${endpoint} request failed`);
      }
    } catch (err) {
      // Rethrow known errors
      if (err instanceof CoreApiError) {
        throw err;
      }

      throw new Error('Core Seedless API is unreachable');
    }
  }

  async deriveMissingKeys() {
    return this.#mutateSeedlessAccount('deriveMissingKeys');
  }

  async getPublicKeys(): Promise<AddressPublicKeyJson[]> {
    const session = await this.#getSession();
    // get keys and filter out non derived ones and group them
    let rawKeys: cs.KeyInfo[];

    try {
      rawKeys = await session.keys();
    } catch (err) {
      this.#handleError(err);
    }

    const mnemonicDictionaries = Object.entries(
      rawKeys.filter(isValidPublicKey).reduce((acc, key) => {
        const accountIndex = getAddressIndexFromPath(
          seedlessKeyTypeToNetworkVM(key.key_type),
          key.derivation_info.derivation_path,
        );

        const mnemonicId = key.derivation_info.mnemonic_id;

        acc[mnemonicId] ??= {} as KeySetDictionary;
        acc[mnemonicId][accountIndex] ??= [] as KeySet;
        acc[mnemonicId][accountIndex].push({
          type: key.key_type,
          key: AddressPublicKey.fromJSON({
            curve: seedlessKeyTypeToCurve(key.key_type),
            derivationPath: key.derivation_info.derivation_path,
            key: strip0x(key.public_key),
          }).toJSON(),
        });

        return acc;
      }, {} as MnemonicAccountDictionary),
    ).map(
      ([mnemonicId, keySetDictionary]) =>
        [
          mnemonicId,
          Object.entries(keySetDictionary)
            .map(
              ([accountIndex, keySet]) =>
                // Convert the index string to a number so we can sort the key sets by account index
                [Number(accountIndex), keySet] satisfies [number, KeySet],
            )
            .sort(([indexA], [indexB]) => indexA - indexB),
        ] satisfies [string, [number, KeySet][]],
    );

    if (!mnemonicDictionaries.length || !mnemonicDictionaries[0]) {
      throw new Error('No mnemonics have been derived yet');
    }

    const validMnemonicKeySets: Record<string, KeySet[]> = {};

    // If there are multiple mnemonic with valid key sets, we choose the first one.
    for (const [mnemonicId, keySetDictionary] of mnemonicDictionaries) {
      if (!keySetDictionary.length || !keySetDictionary[0]) {
        throw new Error('No keysets have been derived yet');
      }

      const [firstKeySetIndex] = keySetDictionary[0];

      if (firstKeySetIndex !== 0) {
        continue;
      }

      for (const [, keySet] of keySetDictionary) {
        // Since we want no gaps in the accounts, we want to return all the subsequent
        // key sets that contain all of the required key types and stop as soon as we find
        // a key set that does not.
        if (!isValidKeySet(keySet)) {
          break;
        }

        validMnemonicKeySets[mnemonicId] ??= [];
        validMnemonicKeySets[mnemonicId].push(keySet);
      }
    }

    const [validKeySets] = Object.values(validMnemonicKeySets);

    if (!validKeySets || validKeySets.length === 0) {
      throw new Error('No valid accounts can be created');
    }

    return validKeySets.flatMap((keySet) => keySet.map((entry) => entry.key));
  }

  async #getSigningKey(
    type: cs.Secp256k1 | cs.Ed25519,
    lookupPublicKey?: string,
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

  #requiresSolanaSignature(
    address: string,
    signatures: Record<string, Uint8Array | null>,
  ) {
    if (address in signatures) {
      // If our signature is required, check if it's already been added.
      return !signatures[address];
    }

    return false;
  }

  async signSolanaTx(
    base64EncodedTx: string,
    provider: SolanaProvider,
  ): Promise<string> {
    if (!this.#firstAddressPublicKey) {
      throw new Error('Public key not available');
    }
    const txMessage = await deserializeTransactionMessage(
      base64EncodedTx,
      provider,
    );
    const { signatures, messageBytes } = compileSolanaTx(txMessage);

    try {
      const session = await this.#getSession();
      const signingKey = await this.#getSigningKey(
        cs.Ed25519.Solana,
        this.#firstAddressPublicKey.key,
      );
      const address = signingKey.materialId;

      if (!this.#requiresSolanaSignature(address, signatures)) {
        return base64EncodedTx;
      }

      const response = await session.signSolana(signingKey.materialId, {
        message_base64: base64.encode(Uint8Array.from(messageBytes)),
      });
      const { signature: signatureHex } = response.data();
      const signature = hex.decode(strip0x(signatureHex));

      return serializeSolanaTx({
        messageBytes,
        signatures: {
          ...signatures,
          [address]: signature,
        },
      });
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.#firstAddressPublicKey || !this.#firstAddressPublicKey.key) {
      throw new Error('Public key not available');
    }

    if (!this.#network) {
      throw new Error('Unknown network');
    }

    const provider = await getProviderForNetwork(this.#network);
    if (!(provider instanceof JsonRpcApiProvider)) {
      throw new Error('Wrong provider obtained for EVM transaction');
    }

    try {
      const signer = new Signer(
        getEvmAddressFromPubKey(
          Buffer.from(this.#firstAddressPublicKey.key, 'hex'),
        ),
        await this.#getSession(),
        provider,
      );
      // We need to await the signing call here so the errors can be
      // caught by catch clause.
      return await signer.signTransaction(transaction);
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signAvalancheTx(
    request: Avalanche.SignTxRequest,
  ): Promise<Avalanche.SignTxRequest['tx']> {
    assertPresent(this.#networkService, CommonError.UnknownNetwork);

    if (!this.#addressPublicKeys) {
      throw new Error('Public keys not available');
    }

    const isEvmTx = request.tx.getVM() === 'EVM';
    const isMainnet = this.#networkService.isMainnet();
    const session = await this.#getSession();

    try {
      for (const publicKey of this.#addressPublicKeys) {
        const key = isEvmTx
          ? await this.#getSigningKey(cs.Secp256k1.Evm, publicKey.key)
          : await this.#getSigningKey(
              isMainnet ? cs.Secp256k1.Ava : cs.Secp256k1.AvaTest,
              publicKey.key,
            );

        const response = await session.signBlob(key.key_id, {
          message_base64: Buffer.from(sha256(request.tx.toBytes())).toString(
            'base64',
          ),
        });

        request.tx.addSignature(utils.hexToBuffer(response.data().signature));
      }

      return request.tx;
    } catch (err) {
      this.#handleError(err);
    }
  }

  async signTx(
    ins: BitcoinInputUTXO[],
    outs: BitcoinOutputUTXO[],
  ): Promise<Transaction> {
    if (!this.#network || !isBitcoinNetwork(this.#network)) {
      throw new Error(
        'Invalid network: Attempting to sign BTC transaction on non Bitcoin network',
      );
    }

    const provider = await getProviderForNetwork(this.#network);

    if (!(provider instanceof BitcoinProvider)) {
      throw new Error('Wrong provider obtained for BTC transaction');
    }

    const btcNetwork = provider.getNetwork();
    const psbt = createPsbt(ins, outs, btcNetwork);
    const session = await this.#getSession();

    try {
      await Promise.all(
        psbt.txInputs.map((_, i) => {
          if (!this.#firstAddressPublicKey) {
            throw new Error('Public key not available');
          }

          const signer = new SeedlessBtcSigner(
            this.#firstAddressPublicKey.key,
            psbt,
            i,
            ins,
            btcNetwork,
            session,
          );
          return psbt.signInputAsync(i, signer);
        }),
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
    messageType: MessageType.AVALANCHE_SIGN,
    messageParams: Pick<MessageParams, 'data'>,
  ): Promise<Buffer>;
  async signMessage(
    messageType: Exclude<MessageType, MessageType.AVALANCHE_SIGN>,
    messageParams: Pick<MessageParams, 'data'>,
  ): Promise<string>;
  async signMessage(
    messageType: MessageType,
    messageParams: Pick<MessageParams, 'data'>,
  ): Promise<string | Buffer>;
  async signMessage(
    messageType: MessageType,
    messageParams: Pick<MessageParams, 'data'>,
  ): Promise<string | Buffer> {
    assertPresent(this.#networkService, CommonError.UnknownNetwork); // TODO: is networkService actually needed? why is #network not enough?
    if (!this.#firstAddressPublicKey) {
      throw new Error('Public key not available');
    }

    if (messageType === MessageType.AVALANCHE_SIGN) {
      if (!this.#firstAddressPublicKey.key) {
        throw new Error('X/P public key not available');
      }

      const xpProvider = await this.#networkService.getAvalanceProviderXP();
      const addressAVM = await xpProvider
        .getAddress(Buffer.from(this.#firstAddressPublicKey.key, 'hex'), 'X')
        .slice(2); // remove chain prefix
      const message = toUtf8(messageParams.data);

      return Buffer.from(
        strip0x(
          await this.#signBlob(
            addressAVM,
            `0x${Avalanche.digestMessage(message).toString('hex')}`,
          ),
        ),
        'hex',
      );
    }

    const addressEVM = getEvmAddressFromPubKey(
      Buffer.from(this.#firstAddressPublicKey.key, 'hex'),
    ).toLowerCase();

    switch (messageType) {
      case MessageType.ETH_SIGN:
      case MessageType.PERSONAL_SIGN:
        return this.#signEip191(addressEVM, messageParams.data);
      case MessageType.SIGN_TYPED_DATA:
      case MessageType.SIGN_TYPED_DATA_V1:
        return this.#signBlob(
          addressEVM,
          typedSignatureHash(messageParams.data),
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
            : SignTypedDataVersion.V4,
        ).toString('hex');
        return this.#signBlob(addressEVM, `0x${hash}`);
      }

      default:
        throw new Error('Unknown message type method');
    }
  }

  async #signEip191(address: string, data: string): Promise<string> {
    try {
      const session = await this.#getSession();
      const response = await session.signEip191(address, { data });
      return response.data().signature;
    } catch (err) {
      this.#handleError(err);
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
