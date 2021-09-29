import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import { sendErc20Submit, wallet$ } from '@avalabs/wallet-react-components';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { gasPrice$ } from '../../gas/gas';
import { Utils, WalletType } from '@avalabs/avalanche-wallet-sdk';

async function submitSendErc20State(request: ExtensionConnectionMessage) {
  const [token, amount, address, gasLimit] = request.params || [];

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

  if (!token) {
    return {
      ...request,
      error: 'no token in params',
    };
  }

  if (!gasLimit) {
    return {
      ...request,
      error: 'no gas limit in params',
    };
  }

  const wallet = await firstValueFrom(wallet$);

  if (!wallet) {
    return {
      ...request,
      error: 'wallet malformed or undefined',
    };
  }

  const gasPrice = await firstValueFrom(gasPrice$);

  if (!gasPrice) {
    return {
      ...request,
      error: 'gas price malformed or undefined',
    };
  }

  const result = await lastValueFrom(
    sendErc20Submit(
      token,
      Promise.resolve<WalletType>(wallet),
      Utils.stringToBN(amount, 18),
      address,
      gasPrice.bn as any,
      gasLimit
    )
  );

  return {
    ...request,
    result,
  };
}

export const SubmitSendErc20StateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ERC20_SUBMIT, submitSendErc20State];
