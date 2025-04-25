import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '@core/utils';
import Transport from '@ledgerhq/hw-transport';
import { Monitoring } from '@core/common';

export async function getLedgerTransport(): Promise<Transport | null> {
  const [usbTransport, error] = await resolve(TransportWebUSB.openConnected());

  if (usbTransport) {
    return usbTransport;
  }

  if (error) {
    Monitoring.sentryCaptureException(error as Error, Monitoring.SentryExceptionTypes.LEDGER);
    console.error('Unable to open ledger transport', error);
  }

  return null;
}
