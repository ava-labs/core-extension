import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  DerivationPath,
} from '@avalabs/core-wallets-sdk';
import { FireblocksApiData, ImportType } from '../accounts/models';
import { UnsignedTx } from '@avalabs/avalanchejs';
import { TransactionRequest } from 'ethers';
import {
  ImportedAccountSecrets,
  PrimaryWalletSecrets,
  SecretType,
} from '../secrets/models';
import { DistributiveOmit } from '@src/utils/distributiveomit';
import { VMABI, TransactionPayload } from 'hypersdk-client';
import { RpcMethod, SigningData } from '@avalabs/vm-module-types';

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
  | SolanaSigningRequest;

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
