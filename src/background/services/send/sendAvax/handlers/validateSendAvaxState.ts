import { ethersBigNumberToBN, stringToBN } from '@avalabs/utils-sdk';
import {
  sendAvaxCheckFormAndCalculateFees,
  wallet$,
} from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { BN } from 'bn.js';
import { BigNumber } from 'ethers';
import { firstValueFrom, of, startWith, Subject } from 'rxjs';
import { injectable } from 'tsyringe';
@injectable()
export class SendAvaxValidateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_AVAX_VALIDATE];

  constructor(private networkFeeService: NetworkFeeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [amount, address, gasPrice, gasLimit] = request.params || [];

    const gas = await this.networkFeeService.getNetworkFee();

    const state = await firstValueFrom(
      sendAvaxCheckFormAndCalculateFees(
        of(
          gasPrice
            ? {
                bn: ethersBigNumberToBN(BigNumber.from(gasPrice)),
              }
            : { bn: ethersBigNumberToBN(gas?.low || BigNumber.from(0)) }
        ),
        of(stringToBN(amount || '0', 18)).pipe(startWith(new BN(0))),
        of(address).pipe(startWith('')) as Subject<string>,
        wallet$,
        of(gasLimit) as Subject<number>
      )
    );

    return { ...request, result: state };
  };
}
