import { Asset, Blockchain } from '@avalabs/bridge-sdk';
import { TransactionResponse } from '@ethersproject/providers';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import Big from 'big.js';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_TRANSFER_ASSET,
  TransactionResponse,
  [currentBlockchain: Blockchain, amountStr: Big, asset: Asset]
>;

@injectable()
export class BridgeTransferAssetHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_TRANSFER_ASSET as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async (request) => {
    const [currentBlockchain, amount, asset] = request.params;
    // BTC.b has AssetType = BTC and this check prevents it from bridging that
    // if (
    //   !(
    //     asset.assetType === AssetType.ERC20 ||
    //     asset.assetType === AssetType.NATIVE
    //   )
    // ) {
    //   return {
    //     ...request,
    //     error: `Cannot transfer asset type ${asset.assetType}`,
    //   };
    // }

    try {
      const result = await this.bridgeService.transferAsset(
        currentBlockchain,
        amount,
        // This is needed for the bridge to work currently
        asset as any
      );

      if (!result) return { ...request, error: 'Unknown error' };

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
