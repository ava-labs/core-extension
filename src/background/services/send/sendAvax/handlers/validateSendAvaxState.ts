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
import { firstValueFrom, map, Observable, of, startWith, Subject } from 'rxjs';
import { BN, stringToBN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';

async function validateSendAvaxState(request: ExtensionConnectionMessage) {
  const [amount, address, gasPrice, gasLimit] = request.params || [];

  const state = await firstValueFrom(
    sendAvaxCheckFormAndCalculateFees(
      gasPrice$.pipe(
        map((gas) =>
          gasPrice?.bn
            ? { bn: new BN(gasPrice.bn, 'hex'), value: gasPrice.value }
            : gas
        )
      ) as Observable<GasPrice>,
      of(stringToBN(amount || '0', 18)).pipe(
        startWith(new BN(0))
      ) as Subject<BN>,
      of(address).pipe(startWith('')) as Subject<string>,
      wallet$,
      of(gasLimit) as Subject<number>
    )
  );

  return { ...request, result: state };
}

export const ValidateSendAvaxStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_AVAX_VALIDATE, validateSendAvaxState];
