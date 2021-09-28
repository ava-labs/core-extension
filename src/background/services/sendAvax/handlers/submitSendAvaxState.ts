import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { sendAvaxSubmit, wallet$ } from '@avalabs/wallet-react-components';
import { BN, Utils } from '@avalabs/avalanche-wallet-sdk';
import { gasPrice$ } from '../../gas/gas';
import { firstValueFrom } from 'rxjs';

async function submitSendAvaxState(request: ExtensionConnectionMessage) {
  const params = request.params || [];
  const [amount, destinationChain, address] = params;

  if (!amount) {
    return {
      ...request,
      error: 'no amount in params',
    };
  }

  if (!destinationChain) {
    return {
      ...request,
      error: 'no destinationChain in params',
    };
  }

  if (!address) {
    return {
      ...request,
      error: 'no address in params',
    };
  }

  const result = await firstValueFrom(
    sendAvaxSubmit(
      Utils.stringToBN(amount, 9),
      destinationChain,
      address,
      firstValueFrom(gasPrice$) as Promise<{ bn: BN }>,
      firstValueFrom(wallet$)
    )
  );

  return {
    ...request,
    result,
  };
}

export const SubmitSendAvaxStateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_AVAX_SUBMIT, submitSendAvaxState];
