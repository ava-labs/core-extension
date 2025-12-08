import { VM } from '@avalabs/avalanchejs';
import { AddressPublicKeyJson, ExtendedPublicKey } from '@core/types';

export type Device = 'keystone-usb' | 'keystone-qr';

export type UsbDerivationStatus = 'waiting' | 'ready' | 'error';

export type QRCodeDerivationStatus = 'waiting' | 'scanning' | 'error';

export type DerivationStatus = UsbDerivationStatus | QRCodeDerivationStatus;

export type QRCodeErrorType = 'invalid-qr-code' | 'camera-access-denied';

export type USBErrorType = 'unable-to-connect' | 'user-rejected';

export type ErrorType = QRCodeErrorType | USBErrorType;

export type PublicKey = {
  hasActivity?: boolean;
  key: AddressPublicKeyJson;
  vm: VM;
  index: number;
};

export type DerivedKeys = {
  extendedPublicKeys: ExtendedPublicKey[];
  addressPublicKeys: PublicKey[];
  masterFingerprint: string;
};

export type UseKeystonePublicKeyFetcherResult = {
  status: UsbDerivationStatus;
  error?: ErrorType;
  retrieveKeys: (minNumberOfKeys: number) => Promise<DerivedKeys>;
  onRetry: () => Promise<void>;
};

export type UseKeystonePublicKeyFetcher = (
  onActivePublicKeysDiscovered?: (publicKeys: PublicKey[]) => void,
) => UseKeystonePublicKeyFetcherResult;

export type ConnectorCallbacks = {
  onConnectionSuccess: (keys: DerivedKeys) => void;
  onConnectionFailed: VoidFunction;
  onConnectionRetry: VoidFunction;
  onActivePublicKeysDiscovered?: (publicKeys: PublicKey[]) => void;
};
