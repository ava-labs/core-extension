import type { UnsignedTx } from '@avalabs/avalanchejs';
import type {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  DerivationPath,
} from '@avalabs/core-wallets-sdk';
import { RpcMethod, SigningData } from '@avalabs/vm-module-types';
import { DistributiveOmit } from '@core/common';
import { AddressPublicKeyJson, ExtendedPublicKey } from './secrets';
import { type FireblocksApiData, type ImportType } from './account';
import {
  type ImportedAccountSecrets,
  type PrimaryWalletSecrets,
  SecretType,
} from './secrets';
import type { TransactionRequest } from 'ethers';
import { TransactionPayload, VMABI } from 'hypersdk-client';

export interface HVMTransactionRequest {
  txPayload: TransactionPayload;
  abi: VMABI;
}

export type SolanaSigningRequest = Extract<
  SigningData,
  {
    type:
      | RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION
      | RpcMethod.SOLANA_SIGN_TRANSACTION
      | RpcMethod.SOLANA_SIGN_MESSAGE;
  }
>;

export type SignTransactionRequest =
  | TransactionRequest
  | BtcTransactionRequest
  | AvalancheTransactionRequest
  | HVMTransactionRequest
  | SolanaSigningRequest
  | AvalancheNewTransactionRequest;

export type AvalancheNewTransactionRequest = Extract<
  SigningData,
  {
    type:
      | RpcMethod.AVALANCHE_SIGN_TRANSACTION
      | RpcMethod.AVALANCHE_SEND_TRANSACTION;
  }
>;

export const isAvalancheModuleTransactionRequest = (
  sigReq: SignTransactionRequest,
): sigReq is AvalancheNewTransactionRequest =>
  'type' in sigReq &&
  (sigReq.type === RpcMethod.AVALANCHE_SIGN_TRANSACTION ||
    sigReq.type === RpcMethod.AVALANCHE_SEND_TRANSACTION);

export const isSolanaRequest = (
  sigReq: SignTransactionRequest,
): sigReq is SolanaSigningRequest =>
  'type' in sigReq &&
  (sigReq.type === RpcMethod.SOLANA_SIGN_AND_SEND_TRANSACTION ||
    sigReq.type === RpcMethod.SOLANA_SIGN_TRANSACTION ||
    sigReq.type === RpcMethod.SOLANA_SIGN_MESSAGE);

export const isSolanaMsgRequest = (
  sigReq: SolanaSigningRequest,
): sigReq is Extract<
  SolanaSigningRequest,
  { type: RpcMethod.SOLANA_SIGN_MESSAGE }
> => sigReq.type === RpcMethod.SOLANA_SIGN_MESSAGE;

export interface BtcTransactionRequest {
  inputs: BitcoinInputUTXO[];
  outputs: BitcoinOutputUTXO[];
}

export interface AvalancheTransactionRequest {
  tx: UnsignedTx;
  externalIndices?: number[];
  internalIndices?: number[];
}

export interface WalletLockedState {
  locked: boolean;
}

export type WalletSecretInStorage = {
  wallets: PrimaryWalletSecrets[];
  importedAccounts?: Record<string, ImportedAccountSecrets>;
};

export type PrivateKeyWalletData = {
  type: ImportType.PRIVATE_KEY;
  secret: string;
};

export type WalletConnectWalletData = {
  type: ImportType.WALLET_CONNECT;
  addresses: {
    addressC: string;
  };
  pubKey?: PubKeyType;
};

export type FireblocksWalletData = {
  type: ImportType.FIREBLOCKS;
  addresses: {
    addressC: string;
    addressBTC?: string;
  };
  api?: FireblocksApiData;
};

export type ImportedWalletData =
  | PrivateKeyWalletData
  | WalletConnectWalletData
  | FireblocksWalletData;

export enum WalletEvents {
  WALLET_STATE_UPDATE = 'wallet-state-updated',
}

export const WALLET_STORAGE_KEY = 'wallet';

export const SUPPORTED_PRIMARY_SECRET_TYPES = [
  SecretType.Mnemonic,
  SecretType.Keystone,
  SecretType.Keystone3Pro,
  SecretType.Ledger,
  SecretType.LedgerLive,
  SecretType.Seedless,
];

export type WalletMetadata = {
  id: string;
  name?: string;
};

export type WalletDetails =
  | {
      id: string;
      type: SecretType;
      name?: string;
      derivationPath: DerivationPath;
      authProvider?: never;
      userEmail?: never;
      userId?: never;
    }
  | {
      id: string;
      type: SecretType.Seedless;
      name?: string;
      derivationPath: DerivationPath;
      authProvider: SeedlessAuthProvider;
      userEmail?: string;
      userId?: string;
    };

export type WalletsInfo = {
  activeWallet?: WalletDetails;
  wallets: WalletMetadata[];
};

export enum SeedlessAuthProvider {
  Google = 'google',
  Apple = 'apple',
}

export type BtcWalletPolicyDetails = {
  hmacHex: string;
  /**
   * Extended public key of m/44'/60'/n
   */
  xpub: string;
  masterFingerprint: string;
  name: string;
};

/**
 * Used for Ledger Live accounts on ledger.
 */
export type PubKeyType = {
  evm: string;
  /**
   * Public keys used for X/P chain are from a different derivation path.
   */
  xp?: string;
  svm?: string;
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
  ed25519?: string;
};

export type SigningResult =
  | { txHash: string; signedTx?: never }
  | { signedTx: string; txHash?: never };

type PrimaryWalletSecretsWithOptionalName = DistributiveOmit<
  PrimaryWalletSecrets,
  'name'
> & {
  name?: string;
};

export type AddPrimaryWalletSecrets = DistributiveOmit<
  PrimaryWalletSecretsWithOptionalName,
  'id'
>;

export type ImportSeedphraseWalletParams = {
  mnemonic: string;
  name?: string;
};

export type ImportLedgerWalletParams =
  | {
      addressPublicKeys: AddressPublicKeyJson[];
      extendedPublicKeys: ExtendedPublicKey[];
      name?: string;
    }
  | LegacyImportLedgerWalletParams;

export type LegacyImportLedgerWalletParams = {
  xpub: string;
  xpubXP: string;
  pubKeys?: PubKeyType[];
  secretType: SecretType.Ledger | SecretType.LedgerLive;
  name?: string;
  dryRun?: boolean;
  numberOfAccountsToCreate?: number;
};

export const isLegacyImportLedgerWalletParams = (
  params: ImportLedgerWalletParams,
): params is LegacyImportLedgerWalletParams => {
  return 'xpub' in params || 'pubKeys' in params;
};

export type ImportWalletResult = {
  type: SecretType;
  name?: string;
  id: string;
};

export const MESSAGE_SIGNING_METHODS = [
  RpcMethod.SOLANA_SIGN_MESSAGE,
  RpcMethod.AVALANCHE_SIGN_MESSAGE,
  RpcMethod.SIGN_TYPED_DATA_V3,
  RpcMethod.SIGN_TYPED_DATA_V4,
  RpcMethod.SIGN_TYPED_DATA_V1,
  RpcMethod.SIGN_TYPED_DATA,
  RpcMethod.PERSONAL_SIGN,
  RpcMethod.ETH_SIGN,
] satisfies RpcMethod[];

export type MessageSigningMethod = (typeof MESSAGE_SIGNING_METHODS)[number];

export type TransactionSigningMethod = Exclude<RpcMethod, MessageSigningMethod>;

export type ExtractSigningData<T extends RpcMethod> = Extract<
  SigningData,
  { type: T }
>;

export type MessageSigningData = ExtractSigningData<MessageSigningMethod>;

export const isMessageSigningMethod = (
  method: unknown,
): method is MessageSigningMethod => {
  return (
    typeof method === 'string' &&
    (MESSAGE_SIGNING_METHODS as RpcMethod[]).includes(method as RpcMethod)
  );
};

export type ExternaSignerType = 'ledger' | 'keystone-qr' | 'keystone-usb';
