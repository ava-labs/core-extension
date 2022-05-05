import { hexToBN, stringToBN } from '@avalabs/utils-sdk';
import {
  ERC20WithBalance,
  sendErc20Submit,
  wallet$,
} from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom, of, tap } from 'rxjs';
import { injectable } from 'tsyringe';
import { SendService } from '../../SendService';

@injectable()
export class SendErc20SubmitHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_ERC20_SUBMIT];

  constructor(
    private sendService: SendService,
    private walletService: WalletService,
    private networkFeeService: NetworkFeeService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [token, amount, address, gasLimit, customGasPrice] =
      request.params || [];

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

    const gasPrice = customGasPrice
      ? { bn: hexToBN(customGasPrice) }
      : await this.networkFeeService.getNetworkFee();

    if (!gasPrice?.bn) {
      return {
        ...request,
        error: 'gas price malformed or undefined',
      };
    }

    if (!this.walletService.walletState?.erc20Tokens) {
      return {
        ...request,
        error: 'wallet locked',
      };
    }

    const balances = this.walletService.walletState.erc20Tokens.reduce(
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
          Promise.resolve(wallet),
          stringToBN(amount, token.denomination),
          address,
          Promise.resolve(gasPrice),
          of(balances) as any,
          gasLimit
        ).pipe(tap((value) => this.sendService.transactionUpdated(value)))
      )
    ).then(([result, error]) => {
      return {
        ...request,
        result: result || undefined,
        error: error ? error?.message || error.toString() : undefined,
      };
    });
  };
}
