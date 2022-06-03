import { WalletType } from '@avalabs/avalanche-wallet-sdk';
import { ethersBigNumberToBN } from '@avalabs/utils-sdk';
import { sendNftSubmit, wallet$ } from '@avalabs/wallet-react-components';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { resolve } from '@src/utils/promiseResolver';
import { BN } from 'bn.js';
import { BigNumber } from 'ethers';
import { firstValueFrom, tap } from 'rxjs';
import { injectable } from 'tsyringe';
import { SendService } from '../../SendService';
@injectable()
export class SendNftSubmitHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_NFT_SUBMIT];

  constructor(
    private sendService: SendService,
    private networkFeeService: NetworkFeeService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params || [];
    const [contractAddress, tokenId, address, gasLimit, customGasPrice] =
      params;

    if (!address) {
      return {
        ...request,
        error: 'no destinationAddress in params',
      };
    }

    if (!contractAddress) {
      return {
        ...request,
        error: 'no contractAddress in params',
      };
    }

    if (!tokenId) {
      return {
        ...request,
        error: 'no tokenId in params',
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

    const gas = await this.networkFeeService.getNetworkFee();
    const gasPrice = customGasPrice
      ? { bn: ethersBigNumberToBN(BigNumber.from(customGasPrice)) }
      : { bn: gas ? ethersBigNumberToBN(gas?.low) : new BN(0) };

    if (!gasPrice?.bn) {
      return {
        ...request,
        error: 'gas price malformed or undefined',
      };
    }

    return await resolve(
      firstValueFrom(
        sendNftSubmit(
          contractAddress,
          Number(tokenId),
          Promise.resolve<WalletType>(wallet),
          address,
          Promise.resolve(gasPrice),
          gasLimit
        ).pipe(
          tap(
            (value) => value.txId && this.sendService.transactionUpdated(value)
          )
        )
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
