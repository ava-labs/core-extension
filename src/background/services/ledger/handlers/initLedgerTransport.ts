import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom, timer } from 'rxjs';
import { getLedgerTransport } from '../utils/getLedgerTransport';

export async function initLedgerTransport() {
  // can throw device disconnected error breaking the background script
  const [transport, error] = await resolve(getLedgerTransport());

  if (!transport || error) {
    throw new Error('Unable to get transport');
  }
  // wait 1.5 a second to prevent `Ledger Device is busy (lock getAppConfiguration)` error on nano S
  await firstValueFrom(timer(1500));

  ledgerTransport$.next(transport);
}

async function initLedgerTransportHandler(request: ExtensionConnectionMessage) {
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
