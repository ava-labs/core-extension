import { AddressPublicKeyJson, ExtendedPublicKey } from '@core/types';

export type Device = 'keystone-usb' | 'keystone-qr';

export type UsbDerivationStatus = 'waiting' | 'ready' | 'error';

export type QRCodeDerivationStatus = 'waiting' | 'scanning' | 'error';

export type DerivationStatus = UsbDerivationStatus | QRCodeDerivationStatus;

export type QRCodeErrorType = 'invalid-qr-code' | 'camera-access-denied';

export type USBErrorType = 'unable-to-connect' | 'unsupported-version';

export type ErrorType = QRCodeErrorType | USBErrorType;

export type PublicKey = {
  key: AddressPublicKeyJson;
  index: number;
};

export type QRCodeDerivedKeys = {
  extendedPublicKeys: ExtendedPublicKey[];
  addressPublicKeys: PublicKey[];
  masterFingerprint: string;
};
