import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import {
  checkAndValidateSendErc20,
  ERC20,
  wallet$,
} from '@avalabs/wallet-react-components';
import { gasPrice$ } from '../../gas/gas';
import { firstValueFrom, Observable, of, Subject } from 'rxjs';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import { walletState$ } from '../../wallet/walletState';
import { isWalletLocked } from '../../wallet/models';
import { Utils } from '@avalabs/avalanche-wallet-sdk';

async function validateSendErc20State(request: ExtensionConnectionMessage) {
  const [token, amount, address] = request.params || [];

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

  const walletState = await firstValueFrom(walletState$);

  if (walletState && isWalletLocked(walletState)) {
    return {
      ...request,
      error: 'wallet locked',
    };
  }

  const balances = walletState?.erc20Tokens.reduce(
    (acc: { [key: string]: ERC20 }, token) => {
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
      gasPrice$ as Observable<{ bn: BN }>,
      of(Utils.stringToBN(amount, 18)) as Subject<BN>,
      of(address) as Subject<string>,
      of(balances) as Subject<typeof balances>,
      wallet$
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
