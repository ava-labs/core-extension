import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  sendAvaxCheckFormAndCalculateFees,
  wallet$,
} from '@avalabs/wallet-react-components';
import { gasPrice$ } from '../../../gas/gas';
import { firstValueFrom, Observable, of, startWith, Subject } from 'rxjs';
import { Utils, BN } from '@avalabs/avalanche-wallet-sdk';

async function validateSendAvaxState(request: ExtensionConnectionMessage) {
  const [amount, address] = request.params || [];

  const state = await firstValueFrom(
    sendAvaxCheckFormAndCalculateFees(
      gasPrice$ as Observable<{ bn: BN }>,
      of(Utils.stringToBN(amount || '0', 18)).pipe(
        startWith(new BN(0))
      ) as Subject<BN>,
      of(address).pipe(startWith('')) as Subject<string>,
      wallet$
    )
  );

  return { ...request, result: state };
}

export const ValidateSendAvaxStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_AVAX_VALIDATE, validateSendAvaxState];
