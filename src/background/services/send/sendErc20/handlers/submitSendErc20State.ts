import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  ERC20WithBalance,
  sendErc20Submit,
  wallet$,
  walletState$,
} from '@avalabs/wallet-react-components';
import { firstValueFrom, of, tap } from 'rxjs';
import { gasPrice$ } from '../../../gas/gas';
import { Utils, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { sendTxDetails$ } from '../../events/sendTxDetailsEvent';
import { resolve } from '@src/utils/promiseResolver';
import { isWalletLocked } from '@src/background/services/wallet/models';

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

  const walletState = await firstValueFrom(walletState$);

  if (walletState && isWalletLocked(walletState)) {
    return {
      ...request,
      error: 'wallet locked',
    };
  }

  const balances = walletState?.erc20Tokens.reduce(
    (acc: { [key: string]: ERC20WithBalance }, token) => {
      return {
        ...acc,
        [token.address]: token,
      };
    },
    {}
  );

  return await resolve(
    firstValueFrom(
      sendErc20Submit(
        token,
        Promise.resolve<WalletType>(wallet),
        Utils.stringToBN(amount, token.denomination),
        address,
        Promise.resolve(gasPrice),
        of(balances) as any,
        gasLimit
      ).pipe(tap((value) => sendTxDetails$.next(value)))
    )
  ).then(([result, error]) => {
    return {
      ...request,
      result: result || undefined,
      error: error ? error?.message || error.toString() : undefined,
    };
  });
}

export const SubmitSendErc20StateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ERC20_SUBMIT, submitSendErc20State];
