import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';
import { ledgerDeviceRequest$, ledgerDeviceResponse$ } from '../ledger';
import { LedgerTransport } from '../LedgerTransport';

export async function initLedgerTransport() {
  ledgerTransport$.next(
    new LedgerTransport(ledgerDeviceRequest$, ledgerDeviceResponse$)
  );
}

async function initLedgerTransportHandler(request: ExtensionConnectionMessage) {
  const currentTransport = await firstValueFrom(ledgerTransport$);

  if (currentTransport) {
    return {
      ...request,
    };
  }

  try {
    await initLedgerTransport();
  } catch (e) {
    return {
      ...request,
      error: (e as Error).message,
    };
  }

  return {
    ...request,
  };
}

export const InitLedgerTransportRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.LEDGER_INIT_TRANSPORT, initLedgerTransportHandler];
