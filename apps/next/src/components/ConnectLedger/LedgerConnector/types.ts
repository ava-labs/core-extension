import { VM } from '@avalabs/avalanchejs';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { AddressPublicKeyJson, ExtendedPublicKey } from '@core/types';

export type DerivationStatus = 'waiting' | 'ready' | 'error';
export type ErrorType =
  | 'unable-to-connect'
  | 'unsupported-version'
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
  retrieveKeys: (minNumberOfKeys: number) => Promise<DerivedKeys>;
  onRetry: () => Promise<void>;
};

export type UseLedgerPublicKeyFetcher = (
  derivationPathSpec?: DerivationPath,
  onActivePublicKeysDiscovered?: (publicKeys: PublicKey[]) => void,
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
