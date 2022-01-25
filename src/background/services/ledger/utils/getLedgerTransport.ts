import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { resolve } from '../../../../utils/promiseResolver';
import { firstValueFrom } from 'rxjs';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { ledgerTransport$ } from '@avalabs/wallet-react-components';

export async function getLedgerTransport() {
  const transport = await firstValueFrom(ledgerTransport$);
  if (transport) {
    await transport.close();
  }

  const [usbTransport] = await resolve(TransportWebUSB.openConnected());
  if (usbTransport) {
    return usbTransport;
  }

  const [hidTransport] = await resolve(TransportWebHID.openConnected());
  if (hidTransport) {
    return hidTransport;
  }

  const [u2fTransport] = await resolve(TransportU2F.create());
  if (u2fTransport) {
    return u2fTransport;
  }
  return undefined;
}
