import { VM } from '@avalabs/avalanchejs';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import {
  AddressPublicKeyJson,
  DerivationStatus,
  ExtendedPublicKey,
} from '@core/types';

export type ErrorType =
  | 'unable-to-connect'
  | 'unsupported-version'
  | 'incorrect-app'
  | 'no-app'
  | 'device-locked'
  | 'duplicated-wallet';
export type PublicKey = {
  hasActivity?: boolean;
  key: AddressPublicKeyJson;
  vm: VM | 'SVM';
  index: number;
};

export type ExtendedPublicKeyMap = Map<number, string>;

export type DerivedKeys = {
  addressPublicKeys: PublicKey[];
  extendedPublicKeys?: ExtendedPublicKey[];
};

export type UseLedgerPublicKeyFetcherResult = {
  status: DerivationStatus;
  error?: ErrorType;
  duplicatedWalletName?: string;
  retrieveKeys: (minNumberOfKeys: number) => Promise<DerivedKeys>;
  onRetry: () => Promise<void>;
};

export type UseLedgerPublicKeyFetcher = (
  derivationPathSpec: DerivationPath | undefined,
  onActivePublicKeysDiscovered: ((publicKeys: PublicKey[]) => void) | undefined,
) => UseLedgerPublicKeyFetcherResult;

export type ConnectorCallbacks = {
  onConnectionSuccess: VoidFunction;
  onConnectionFailed: (error: Error) => void;
  onConnectionRetry: VoidFunction;
};

export class WalletExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletExistsError';
  }
}
