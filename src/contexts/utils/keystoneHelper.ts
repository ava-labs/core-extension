import { resolve } from '@src/utils/promiseResolver';
import sentryCaptureException, {
  SentryExceptionTypes,
} from '@src/monitoring/sentryCaptureException';
import {
  createKeystoneTransport,
  TransportWebUSB,
} from '@keystonehq/hw-transport-webusb';
import Avalanche from '@keystonehq/hw-app-avalanche';

const setupAvalancheApp = (transport: TransportWebUSB): Avalanche => {
  return new Avalanche(transport);
};

export async function getKeystoneTransport(): Promise<Avalanche | null> {
  const [usbTransport, error] = await resolve(createKeystoneTransport());

  if (usbTransport) {
    return setupAvalancheApp(usbTransport);
  }

  if (error) {
    sentryCaptureException(error as Error, SentryExceptionTypes.KEYSTONE);
    console.error('Unable to open keystone transport', error);
  }

  return null;
}
