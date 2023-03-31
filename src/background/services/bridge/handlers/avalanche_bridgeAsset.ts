import { Blockchain, getBtcAsset } from '@avalabs/bridge-sdk';
import { bnToBig, stringToBN } from '@avalabs/utils-sdk';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { injectable } from 'tsyringe';
import { Action } from '../../actions/models';
import { BridgeService } from '../BridgeService';

// this is used for core web
@injectable()
export class AvalancheBridgeAsset extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_BRIDGE_ASSET];

  constructor(private bridgeService: BridgeService) {
    super();
  }

  handleAuthenticated = async (request) => {
    const params = request.params || [];
    const currentBlockchain = params[0];

    if (!currentBlockchain) {
      return {
        ...request,
        error: 'Missing param: blockchain',
      };
    }
    const amountStr = params[1];
    if (!amountStr) {
      return {
        ...request,
        error: 'Missing param: amount',
      };
    }

    let asset = params[2];

    if (currentBlockchain === Blockchain.BITCOIN) {
      const bridgeConfig = this.bridgeService.bridgeConfig;
      const config = bridgeConfig.config;
      asset = config && getBtcAsset(config);
    }

    if (!asset) {
      return {
        ...request,
        error: 'Missing param: asset',
      };
    }

    if (
      currentBlockchain !== asset.nativeNetwork &&
      currentBlockchain !== asset.wrappedNetwork
    ) {
      return {
        ...request,
        error: 'Invalid param: asset',
      };
    }

    const action = {
      ...request,
      displayData: {
        currentBlockchain,
        amountStr,
        asset,
      },
      tabId: request.site.tabId,
    };

    await this.openApprovalWindow(action, `approve?id=${request.id}`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: 'account not connected',
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError,
    frontendTabId?: number
  ) => {
    const currentBlockchain = pendingAction?.displayData.currentBlockchain;
    const amountStr = pendingAction?.displayData.amountStr;
    const asset = pendingAction?.displayData.asset;
    const denomination = asset.denomination;
    const amount = bnToBig(stringToBN(amountStr, denomination), denomination);

    if (currentBlockchain === Blockchain.BITCOIN) {
      try {
        const result = await this.bridgeService.transferBtcAsset(
          amount,
          frontendTabId
        );
        await this.bridgeService.createTransaction(
          Blockchain.BITCOIN,
          result.hash,
          Date.now(),
          Blockchain.AVALANCHE,
          amount,
          'BTC'
        );
        onSuccess(result);
      } catch (e) {
        onError(e);
      }
    } else {
      try {
        const result = await this.bridgeService.transferAsset(
          currentBlockchain,
          amount,
          asset,
          frontendTabId
        );
        if (result) {
          await this.bridgeService.createTransaction(
            currentBlockchain,
            result.hash,
            Date.now(),
            Blockchain.AVALANCHE === currentBlockchain
              ? Blockchain.ETHEREUM
              : Blockchain.AVALANCHE,
            amount,
            asset.symbol
          );
        }

        onSuccess(result);
      } catch (e) {
        onError(e);
      }
    }
  };
}
