import { WalletExistsError } from '../../types';
import { classifyLedgerConnectionError } from './classifyLedgerConnectionError';

function makeError(name: string, message: string) {
  const err = new Error(message);
  err.name = name;
  return err;
}

describe('classifyLedgerConnectionError', () => {
  it.each([
    [
      'LockedDeviceError by name',
      makeError('LockedDeviceError', 'oops'),
      'device_locked',
    ],
    [
      'Locked device 0x5515 by message',
      makeError('Error', 'Ledger device: Locked device (0x5515)'),
      'device_locked',
    ],
    [
      'Wrong app via 0x6700',
      makeError(
        'TransportStatusError',
        'Ledger device: Incorrect length (0x6700)',
      ),
      'wrong_app',
    ],
    [
      'TransportRaceCondition by name',
      makeError('TransportRaceCondition', 'race'),
      'transport_race',
    ],
    [
      'Race by message',
      makeError('Error', 'An action was already pending on the Ledger device.'),
      'transport_race',
    ],
    [
      'TransportInterfaceNotAvailable',
      makeError(
        'TransportInterfaceNotAvailable',
        "Failed to execute 'claimInterface'",
      ),
      'usb_busy',
    ],
    [
      'claimInterface message',
      makeError('Error', "Failed to execute 'claimInterface' on 'USBDevice'"),
      'usb_busy',
    ],
    [
      'lock getAddress',
      makeError('TransportError', 'Ledger Device is busy (lock getAddress)'),
      'usb_busy',
    ],
    [
      'Access denied',
      makeError(
        'SecurityError',
        "Failed to execute 'open' on 'USBDevice': Access denied.",
      ),
      'permission_denied',
    ],
    [
      'USB disconnected',
      makeError(
        'NotFoundError',
        "Failed to execute 'close' on 'USBDevice': The device was disconnected.",
      ),
      'usb_disconnected',
    ],
    [
      'publicKey length mismatch',
      makeError(
        'Error',
        'Expected property "publicKey" of type Buffer(Length: 33), got Buffer(Length: 1)',
      ),
      'unexpected_response',
    ],
    [
      'invalid version length',
      makeError('Error', 'getAppAndVersion: invalid version length'),
      'unexpected_response',
    ],
    [
      'public key must be 33 or 65 bytes assertion',
      makeError(
        'AssertionError',
        'AssertionError [ERR_ASSERTION]: Public key must be 33 or 65 bytes.',
      ),
      'unexpected_response',
    ],
    ['unknown', makeError('Error', 'something weird'), 'unknown'],
    ['non-Error throws', 'plain string', 'unknown'],
    ['null', null, 'unknown'],
  ])('classifies %s', (_label, err, expected) => {
    expect(classifyLedgerConnectionError(err)).toBe(expected);
  });

  it('classifies WalletExistsError', () => {
    expect(classifyLedgerConnectionError(new WalletExistsError('dup'))).toBe(
      'duplicated_wallet',
    );
  });
});
