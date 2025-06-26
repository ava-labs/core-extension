import { VM } from '@avalabs/avalanchejs';
import { DerivationPath } from '@avalabs/core-wallets-sdk';
import { AddressPublicKeyJson, ExtendedPublicKey } from '@core/types';

export type DerivationStatus = 'waiting' | 'ready' | 'error';
export type ErrorType = 'unable-to-connect' | 'unsupported-version';
export type PublicKey = {
  key: AddressPublicKeyJson;
  vm: VM | 'SVM';
  index: number;
};

export type DerivedKeys = {
  addressPublicKeys: PublicKey[];
  extendedPublicKeys?: ExtendedPublicKey[];
};

export type UseLedgerPublicKeyFetcherResult = {
  status: DerivationStatus;
  error?: ErrorType;
  retrieveKeys: (indexes: number[]) => Promise<DerivedKeys>;
  onRetry: () => Promise<void>;
};

export type UseLedgerPublicKeyFetcher = (
  derivationPathSpec?: DerivationPath,
) => UseLedgerPublicKeyFetcherResult;
