import { ledgerTransport$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { firstValueFrom } from 'rxjs';

export async function hasLedgerTransport(request: ExtensionConnectionMessage) {
  const result = await firstValueFrom(ledgerTransport$);

  return {
    ...request,
    result,
  };
}

export const HasLedgerTransportRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.LEDGER_HAS_TRANSPORT, hasLedgerTransport];
