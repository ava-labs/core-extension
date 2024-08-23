import {
  ApprovalParams,
  ApprovalResponse,
  ApprovalController as IApprovalController,
  RpcMethod,
} from '@avalabs/vm-module-types';
import { DisplayData_BitcoinSendTx } from '../services/wallet/handlers/models';
import { Action } from '../services/actions/models';
import { openApprovalWindow } from '../runtime/openApprovalWindow';
import { VIA_MODULE_SYMBOL } from './models';

class ApprovalController implements IApprovalController {
  onTransactionConfirmed = (txHash: `0x${string}`) => {
    console.log(
      'DEBUG Transaction Confirmed. Show a toast? Trigger browser notification?',
      txHash
    );
  };

  onTransactionReverted = (txHash: `0x${string}`) => {
    console.log(
      'DEBUG Transaction Confirmed. Show a toast? Trigger browser notification?',
      txHash
    );
  };

  requestApproval = async (
    params: ApprovalParams
  ): Promise<ApprovalResponse> => {
    // 1. Generate an Action model based on the incoming request.
    const action = this.#buildAction(params);

    // 2. Setup listeners on ActionsService, waiting for the action
    //		to be concluded (approved, rejected or timeout)
    //
    //		Remember that actions can also be updated (i.e. fee could be updated).
    //		If it is, this gets a bit tricky for Bitcoin. The reason is that I guess
    //		the Modules should be the source of truth here and only provide us with
    //		inputs/outputs arrays, but if the user updates the fee on the approval screen,
    //		we need to may need to re-generate the inputs/outputs (i.e. to select different
    //		UTXOs). So, should we then ask the Bitcoin Module to create the signing data again?
    //		Seems cumbersome. So for now we agreed that the frontend could reconstruct the
    //		inputs/outputs arrays (just like it does for the Send feature at the moment).
    //		There is a Slack convo with the mobile team about this, feel free to ask to get
    //		added to it so you can see more details.

    // 3. Open the approval screen
    const url = this.#getPopupUrl(params.request.method);
    openApprovalWindow(action, url);

    // 4. Wait for one of the listeners from step 2 to be triggered.
    //		If approved, call WalletService.sign(...) and return the result
    //		If declined or error, return { error: <message> }

    return {
      result: 'oopsies',
    };
  };

  #getPopupUrl = (method: RpcMethod) => {
    if (method === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      return 'approve/bitcoinSignTx';
    }

    throw new Error('Unrecognized method ' + method);
  };

  #buildAction = (params: ApprovalParams): Action => {
    if (params.signingData.type === RpcMethod.BITCOIN_SEND_TRANSACTION) {
      const displayData: DisplayData_BitcoinSendTx = {
        from: params.signingData.account,
        address: params.signingData.data.to,
        amount: params.signingData.data.amount,
        sendFee: params.signingData.data.fee,
        feeRate: params.signingData.data.feeRate,
        balance: params.signingData.data.balance as any, // FIXME: this should not be needed when BTC balance changes are merged

        // FIXME: populate it.
        // Bridge feature should add `context` to the `bitcoin_sendTransaction` request,
        // which should then be passed back by the module and can be used here to add more
        // context for the approval screen (i.e. telling the user they're approving a bridge tx).
        displayOptions: {} as any,
      };

      return {
        // ActionService needs to know it should not look for the handler
        // in the tsyringe registry, but rather just emit the events for
        // it for the ApprovalController to catch
        [VIA_MODULE_SYMBOL]: true,
        displayData,
        scope: params.request.chainId,
        id: params.request.requestId,
        method: params.request.method as any, // FIXME: typings
      };
    }

    throw new Error('Unrecognized method ' + params.request.method);
  };
}

export default new ApprovalController();
