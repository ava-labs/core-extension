import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { WalletService } from '../../wallet/WalletService';
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { injectable } from 'tsyringe';

@injectable()
export class BridgeTransferAssetHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_TRANSFER_ASSET];

  constructor(
    private bridgeService: BridgeService,
    private walletService: WalletService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const [currentBlockchain, amountStr, asset] = request.params || [];

    const amount = bnToBig(
      stringToBN(amountStr, asset.denomination),
      asset.denomination
    );

    try {
      const result = await this.bridgeService.transferAsset(
        currentBlockchain,
        amount,
        asset
      );

      return {
        ...request,
        result,
      };
    } catch (error: any) {
      // user declined the transaction
      console.error(error);

      return {
        ...request,
        error: 'User declined the transaction',
      };
    }
  };
}
