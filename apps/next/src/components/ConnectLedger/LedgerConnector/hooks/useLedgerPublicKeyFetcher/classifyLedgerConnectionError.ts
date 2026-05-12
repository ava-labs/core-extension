import { WalletExistsError } from '../../types';

export type LedgerConnectionFailureReason =
  | 'device_locked'
  | 'wrong_app'
  | 'usb_busy'
  | 'transport_race'
  | 'usb_disconnected'
  | 'permission_denied'
  | 'unexpected_response'
  | 'duplicated_wallet'
  | 'unknown';

/**
 * Maps an error thrown during Ledger key derivation into a stable, enumerated
 * `reason` string used as a property on analytics events. Values must not carry
 * user PII (no email, no public keys, no addresses) — only the classified
 * error class.
 */
export function classifyLedgerConnectionError(
  err: unknown,
): LedgerConnectionFailureReason {
  if (err instanceof WalletExistsError) {
    return 'duplicated_wallet';
  }

  const name = err instanceof Error ? err.name : '';
  const message = err instanceof Error ? err.message : String(err ?? '');

  if (
    name === 'LockedDeviceError' ||
    message.includes('Locked device') ||
    message.includes('0x5515')
  ) {
    return 'device_locked';
  }

  if (message.includes('0x6700') || /Incorrect length/i.test(message)) {
    return 'wrong_app';
  }

  if (
    name === 'TransportRaceCondition' ||
    /action was already pending/i.test(message)
  ) {
    return 'transport_race';
  }

  if (
    name === 'TransportInterfaceNotAvailable' ||
    /claim(?:Interface)?/i.test(message) ||
    /lock getAddress/i.test(message) ||
    /Ledger Device is busy/i.test(message)
  ) {
    return 'usb_busy';
  }

  if (/Access denied/i.test(message)) {
    return 'permission_denied';
  }

  if (/device was disconnected/i.test(message)) {
    return 'usb_disconnected';
  }

  if (
    (/publicKey/.test(message) && /length/i.test(message)) ||
    /invalid version length/i.test(message) ||
    /Public key must be 33 or 65 bytes/i.test(message)
  ) {
    return 'unexpected_response';
  }

  return 'unknown';
}
