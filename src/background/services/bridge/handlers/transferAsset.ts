import { Asset, Blockchain } from '@avalabs/bridge-sdk';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { ExtensionRequestHandler } from '@src/background/connections/models';
import Big from 'big.js';
import { injectable } from 'tsyringe';
import { BridgeService } from '../BridgeService';
import { CustomGasSettings } from '../models';
import { ethErrors } from 'eth-rpc-errors';
import { CommonError, isWrappedError } from '@src/utils/errors';

type HandlerType = ExtensionRequestHandler<
  ExtensionRequest.BRIDGE_TRANSFER_ASSET,
  { hash: string },
  [
    currentBlockchain: Blockchain,
    amountStr: Big,
    asset: Asset,
    customGasSettings?: CustomGasSettings
  ]
>;

@injectable()
export class BridgeTransferAssetHandler implements HandlerType {
  method = ExtensionRequest.BRIDGE_TRANSFER_ASSET as const;

  constructor(private bridgeService: BridgeService) {}

  handle: HandlerType['handle'] = async ({ request }) => {
    const [currentBlockchain, amount, asset, customGasSettings] =
      request.params;

    try {
      if (currentBlockchain === Blockchain.BITCOIN) {
        return {
          ...request,
          result: await this.bridgeService.transferBtcAsset(
            amount,
            customGasSettings,
            request.tabId
          ),
        };
      } else {
        const txHash = await this.bridgeService.transferAsset(
          currentBlockchain,
          amount,
          // This is needed for the bridge to work currently
          asset as any,
          customGasSettings,
          request.tabId
        );

        if (!txHash) {
          return {
            ...request,
            error: ethErrors.rpc.internal({
              data: { reason: CommonError.Unknown },
            }),
          };
        }

        return {
          ...request,
          result: {
            hash: txHash,
          },
        };
      }
    } catch (err) {
      return {
        ...request,
        error:
          isWrappedError(err) || typeof err === 'string'
            ? err
            : ethErrors.rpc.internal({ data: { reason: CommonError.Unknown } }),
      };
    }
  };
}
