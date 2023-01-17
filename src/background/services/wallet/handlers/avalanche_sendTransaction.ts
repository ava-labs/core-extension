import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { UnsignedTx, EVMUnsignedTx } from '@avalabs/avalanchejs-v2';
import { parseAvalancheTx } from '@src/background/services/wallet/utils/parseAvalancheTx';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';

@injectable()
export class AvalancheSendTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SEND_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const params = request.params ?? [];
    const unsignedTxJson = params[0];

    if (!unsignedTxJson) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing unsigned transaction JSON object',
        }),
      };
    }

    const unsignedTx = UnsignedTx.fromJSON(unsignedTxJson);
    const vm = unsignedTx.getVM();

    const prov = await this.networkService.getAvalanceProviderXP();
    const txBuff = Buffer.from(unsignedTx.toBytes());
    const txData = parseAvalancheTx(txBuff, vm, prov.getContext());

    // Throw an error if we can't parse the transaction
    if (txData.type === 'unknown') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type?',
        }),
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        unsignedTxJson,
        txBuffer: txBuff,
        txData,
        vm,
      },
    };
    await this.openApprovalWindow(
      actionData,
      `approve/avalancheSignTx?id=${request.id}`
    );

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = (request) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  onActionApproved = async (
    pendingAction: Action,
    result,
    onSuccess,
    onError
  ) => {
    try {
      const {
        displayData: { txBuffer, vm, unsignedTxJson },
      } = pendingAction;

      // We need to know if transaction is on C or X/P, the generated tx object is slightly different for C
      // EVM in Avalanche context means the CoreEth layer.
      const chainAlias = vm === 'EVM' ? 'C' : 'X';
      // Sign the transaction and return signature
      const sig = await this.walletService.sign(
        {
          tx: Buffer.from(txBuffer, 'hex'),
          chain: chainAlias,
        },
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP()
      );

      // Parse the json into a tx object
      const unsignedTx =
        chainAlias === 'C'
          ? EVMUnsignedTx.fromJSON(unsignedTxJson)
          : UnsignedTx.fromJSON(unsignedTxJson);
      // Add the signature
      unsignedTx.addSignature(Buffer.from(sig, 'hex'));

      if (!unsignedTx.hasAllSignatures())
        throw new Error('Unable to submit transaction, missing signatures.');

      // Submit the transaction and return the tx id
      const prov = await this.networkService.getAvalanceProviderXP();
      const res = await prov.issueTx(unsignedTx.getSignedTx());

      onSuccess(res.txID);
    } catch (e) {
      onError(e);
    }
  };
}
