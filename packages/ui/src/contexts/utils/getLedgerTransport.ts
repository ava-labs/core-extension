import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { resolve } from '@core/common';
import Transport from '@ledgerhq/hw-transport';
import { Monitoring } from '@core/common';
import browser from 'webextension-polyfill';

export async function getLedgerTransport(): Promise<Transport | null> {
  const platformInfo = await browser.runtime.getPlatformInfo();
  const isWebHIDSupported = await TransportWebHID.isSupported();

  const [transport, error] = await resolve<
    TransportWebUSB | TransportWebHID | null
  >(
    platformInfo.os === 'win' && isWebHIDSupported
      ? TransportWebHID.openConnected()
      : TransportWebUSB.openConnected(),
  );

  if (transport) {
    return transport;
  }

  if (error) {
    Monitoring.sentryCaptureException(
      error as Error,
      Monitoring.SentryExceptionTypes.LEDGER,
    );
    console.error('Unable to open ledger transport', error);
  }

  return null;
}
