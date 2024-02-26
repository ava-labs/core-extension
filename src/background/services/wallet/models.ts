import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  DerivationPath,
} from '@avalabs/wallets-sdk';
import { FireblocksApiData, ImportType } from '../accounts/models';
import { UnsignedTx } from '@avalabs/avalanchejs-v2';
import { TransactionRequest } from 'ethers';
import {
  ImportedAccountSecrets,
  PrimaryWalletSecrets,
  SecretType,
} from '../secrets/models';
import { DistributiveOmit } from '@src/utils/distributiveomit';
import { SignerSessionData } from '@cubist-labs/cubesigner-sdk';

export type SignTransactionRequest =
  | TransactionRequest
  | BtcTransactionRequest
  | AvalancheTransactionRequest;

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
    }
  | {
      id: string;
      type: SecretType.Seedless;
      name?: string;
      derivationPath: DerivationPath;
      authProvider: SeedlessAuthProvider;
      userEmail: string;
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
  btcWalletPolicyDetails?: BtcWalletPolicyDetails;
};

export type SigningResult =
  | { txHash: string; signedTx?: never }
  | { signedTx: string; txHash?: never };

export type AddPrimaryWalletSecrets = DistributiveOmit<
  PrimaryWalletSecrets,
  'id'
>;

export type WalletKeys = {
  mnemonic?: string;
  masterFingerprint?: string;
  pubKeys?: PubKeyType[];
  xpub?: string;
  xpubXP?: string;
  seedlessSignerToken?: SignerSessionData;
};
