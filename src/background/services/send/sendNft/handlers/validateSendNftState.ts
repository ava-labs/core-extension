import { ethersBigNumberToBN } from '@avalabs/utils-sdk';
import {
  checkAndValidateSendNft,
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
import { firstValueFrom, of } from 'rxjs';
import { injectable } from 'tsyringe';
@injectable()
export class SendNftValidateHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.SEND_NFT_VALIDATE];

  constructor(private networkFeeService: NetworkFeeService) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const params = request.params || [];
    const [contractAddress, tokenId, address, gasPrice, gasLimit] = params;

    if (!contractAddress) {
      return {
        ...request,
        error: 'no contractAddress in params',
      };
    }

    if (!tokenId) {
      return {
        ...request,
        error: 'no contractAddress in params',
      };
    }

    const gas = await this.networkFeeService.getNetworkFee();
    const result = await firstValueFrom(
      checkAndValidateSendNft(
        contractAddress,
        Number(tokenId),
        of(
          gasPrice
            ? { bn: ethersBigNumberToBN(BigNumber.from(gasPrice)) }
            : { bn: gas ? ethersBigNumberToBN(gas?.low) : new BN(0) }
        ),
        of(address || ''),
        wallet$,
        of(gasLimit)
      )
    );

    return {
      ...request,
      result,
    };
  };
}
