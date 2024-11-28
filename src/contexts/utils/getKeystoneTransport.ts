import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '../../utils/promiseResolver';
import Transport from '@ledgerhq/hw-transport';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import { createKeystoneTransport } from '@keystonehq/hw-transport-webusb';

export async function getKeystoneTransport(): Promise<Transport | null> {
  // const [usbTransport, error] = await resolve(TransportWebUSB.openConnected());
  const [usbTransport, error] = await resolve(createKeystoneTransport());

  if (usbTransport) {
    return usbTransport;
  }

  if (error) {
    sentryCaptureException(error as Error, SentryExceptionTypes.LEDGER);
    console.error('Unable to open ledger transport', error);
  }

  return null;
}
