import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  checkAndValidateSendErc20,
  ERC20WithBalance,
  wallet$,
} from '@avalabs/wallet-react-components';
import { gasPrice$ } from '../../../gas/gas';
import { firstValueFrom, map, Observable, of, startWith, Subject } from 'rxjs';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { walletState$ } from '../../../wallet/walletState';
import { isWalletLocked } from '../../../wallet/models';
import { stringToBN } from '@avalabs/avalanche-wallet-sdk';
import { GasPrice } from '@src/background/services/gas/models';

async function validateSendErc20State(request: ExtensionConnectionMessage) {
  const [token, amount, address, gasPrice, gasLimit] = request.params || [];

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

  if (!balances) {
    return {
      ...request,
      error: 'no token balances',
    };
  }

  const result = await firstValueFrom(
    checkAndValidateSendErc20(
      token,
      gasPrice$.pipe(
        map((gas) => {
          return gasPrice?.bn
            ? { bn: new BN(gasPrice.bn, 'hex'), value: gasPrice.value }
            : gas;
        })
      ) as Observable<GasPrice>,
      of(
        stringToBN(amount || 0, (token as ERC20WithBalance).denomination || 18)
      ).pipe(startWith(new BN(0))) as Subject<BN>,
      of(address).pipe(startWith('')) as Subject<string>,
      of(balances) as Subject<typeof balances>,
      wallet$,
      of(gasLimit) as Subject<number>
    )
  );

  return {
    ...request,
    result,
  };
}

export const ValidateSendErc20StateRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.SEND_ERC20_VALIDATE, validateSendErc20State];
