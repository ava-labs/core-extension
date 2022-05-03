import { hexToBN, stringToBN } from '@avalabs/utils-sdk';
import {
  checkAndValidateSendErc20,
  ERC20WithBalance,
  wallet$,
} from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import BN from 'bn.js';
import { firstValueFrom, of, startWith, Subject } from 'rxjs';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { injectable } from 'tsyringe';
@injectable()
export class SendErc20ValidateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_ERC20_VALIDATE];

  constructor(
    private walletService: WalletService,
    private networkFeeService: NetworkFeeService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [token, amount, address, gasPrice, gasLimit] = request.params || [];

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

    if (!balances) {
      return {
        ...request,
        error: 'no token balances',
      };
    }

    const gas = await this.networkFeeService.getNetworkFee();

    const result = await firstValueFrom(
      checkAndValidateSendErc20(
        token,
        of(
          gasPrice?.bn
            ? { bn: hexToBN(gasPrice.bn), value: gasPrice.value }
            : gas
        ),
        of(
          stringToBN(
            amount || 0,
            (token as ERC20WithBalance).denomination || 18
          )
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
  };
}
