import { hexToBN, stringToBN } from '@avalabs/utils-sdk';
import { sendAvaxSubmit, wallet$ } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { resolve } from '@src/utils/promiseResolver';
import { firstValueFrom, tap } from 'rxjs';
import { injectable } from 'tsyringe';
import { SendService } from '../../SendService';
@injectable()
export class SendAvaxSubmitHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_AVAX_SUBMIT];

  constructor(
    private sendService: SendService,
    private networkFeeService: NetworkFeeService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params || [];
    const [amount, destinationChain, address, customGasPrice, customGasLimit] =
      params;

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

    const gas = this.networkFeeService.getNetworkFee();

    return await resolve(
      firstValueFrom(
        sendAvaxSubmit(
          // we only support c chain so this needs ot be 18 decimals
          stringToBN(amount, 18),
          address,
          Promise.resolve(
            customGasPrice
              ? {
                  bn: hexToBN(customGasPrice),
                }
              : gas
          ),
          wallet$,
          customGasLimit
          // c chain only so we dont support memo,
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
