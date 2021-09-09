import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  sendAntCheckFormAndCalculateFees,
  wallet$,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, of, Subject } from 'rxjs';
import { AssetBalanceX, BN } from '@avalabs/avalanche-wallet-sdk';

async function validateSendAntState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [amount, address, token] = params;

  if (!amount) {
    return {
      ...request,
      error: 'no amount in params',
    };
  }

  if (!token) {
    return {
      ...request,
      error: 'no token in params',
    };
  }

  if (!address) {
    return {
      ...request,
      error: 'no address in params',
    };
  }

  const result = await firstValueFrom(
    sendAntCheckFormAndCalculateFees(
      of(new BN(amount)) as Subject<BN>,
      of(address) as Subject<string>,
      of(token) as Subject<AssetBalanceX>,
      wallet$
    )
  );

  return { ...request, result };
}

export const ValidateSendAntStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ANT_VALIDATE, validateSendAntState];
