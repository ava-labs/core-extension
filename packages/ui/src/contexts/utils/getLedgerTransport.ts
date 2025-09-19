import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { resolve } from '@core/common';
import Transport from '@ledgerhq/hw-transport';
import { Monitoring } from '@core/common';
import { shouldUseWebHID } from './shouldUseWebHID';

export async function getLedgerTransport(): Promise<Transport | null> {
  const useWebHID = await shouldUseWebHID();

  const [transport, error] = await resolve<
    TransportWebUSB | TransportWebHID | null
  >(
    useWebHID
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
