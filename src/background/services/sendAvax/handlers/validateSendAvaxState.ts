import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  sendAvaxCheckFormAndCalculateFees,
  wallet$,
} from '@avalabs/wallet-react-components';
import { gasPrice$ } from '../../gas/gas';
import { firstValueFrom, Observable, of, Subject } from 'rxjs';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';

async function validateSendAvaxState(request: ExtensionConnectionMessage) {
  const [amount, address] = request.params || [];

  if (!amount) {
    return {
      ...request,
      error: 'no amount in params',
    };
  }

  if (!address) {
    return {
      ...request,
      error: 'no address in params',
    };
  }

  const state = await firstValueFrom(
    sendAvaxCheckFormAndCalculateFees(
      gasPrice$ as Observable<{ bn: BN }>,
      of(Utils.stringToBN(amount, 9)) as Subject<BN>,
      of(address) as Subject<string>,
      wallet$
    )
  );

  return { ...request, result: state };
}

export const ValidateSendAvaxStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_AVAX_VALIDATE, validateSendAvaxState];
