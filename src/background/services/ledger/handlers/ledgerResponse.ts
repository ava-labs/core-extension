import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { ledgerDeviceResponse$ } from '../ledger';

export async function ledgerResponse(request: ExtensionConnectionMessage) {
  const params = request.params;
  ledgerDeviceResponse$.next(params?.[0]);

  return {
    ...request,
  };
}

export const LedgerResponseRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.LEDGER_RESPONSE, ledgerResponse];
