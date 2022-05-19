import {
  ExtensionConnectionMessage,
  ExtensionConnectionMessageResponse,
  ExtensionRequestHandler,
} from '@src/background/connections/models';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { BridgeService } from '../BridgeService';
import { WalletService } from '../../wallet/WalletService';
import { issueRawTx } from '@avalabs/bridge-sdk';
import { resolve } from '@src/utils/promiseResolver';
import { injectable } from 'tsyringe';

/**
 * FYI: the input UTXOs to the unsignedTxHex must be owned by the wallet
 * (i.e. the C-chain derived bitcoin address)
 */
@injectable()
export class BridgeSignIssueBtcHandler implements ExtensionRequestHandler {
  methods = [ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC];

  constructor(
    private bridgeService: BridgeService,
    private walletService: WalletService
  ) {}

  handle = async (
    request: ExtensionConnectionMessage
  ): Promise<ExtensionConnectionMessageResponse> => {
    const { config } = await this.bridgeService.updateBridgeConfig();

    if (!config) {
      return {
        ...request,
        error: 'Not ready',
      };
    }

    const [unsignedTxHex] = request.params || [];

    const [signedTx, error] = await resolve(
      this.walletService.sign(unsignedTxHex)
    );

    if (error) {
      return {
        ...request,
        error: error.toString(),
      };
    }

    const result = await issueRawTx(signedTx.toHex(), config);

    return {
      ...request,
      result,
    };
  };
}
