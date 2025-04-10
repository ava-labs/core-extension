import { ExtensionConnectionEvent } from '../../../connections/models';
import {
  WalletConnectEvent,
  WalletConnectEventType,
  WalletConnectSessionPermissionsMismatch,
  WalletConnectUriGeneratedEvent,
} from '../models';

export function isUriGeneratedEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<WalletConnectUriGeneratedEvent> {
  return evt?.name === WalletConnectEvent.UriGenerated;
}

export function isSessionPermissionsMismatchEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<WalletConnectSessionPermissionsMismatch> {
  return evt?.name === WalletConnectEvent.SessionPermissionsMismatch;
}

export function isWalletConnectEvent(
  evt: ExtensionConnectionEvent,
): evt is ExtensionConnectionEvent<WalletConnectEventType> {
  const wcEvents = Object.values(WalletConnectEvent) as string[];

  return wcEvents.includes(evt?.name);
}
