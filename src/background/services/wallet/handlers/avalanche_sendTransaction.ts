import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import {
  UnsignedTx,
  EVMUnsignedTx,
  AVM,
  PVM,
  EVM,
} from '@avalabs/avalanchejs-v2';
import { parseAvalancheTx } from '@src/background/services/wallet/utils/parseAvalancheTx';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';

@injectable()
export class AvalancheSendTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.AVALANCHE_SEND_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountsService: AccountsService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const params = request.params ?? [];
    const [unsignedTxJson] = params;

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

    const getAddressByVM = () => {
      const activeAccount = this.accountsService.activeAccount;

      if (!activeAccount) {
        return;
      }

      if (vm === AVM) {
        return activeAccount.addressAVM;
      } else if (vm === PVM) {
        return activeAccount.addressPVM;
      } else if (vm === EVM) {
        return activeAccount.addressCoreEth;
      }
    };

    const currentAddress = getAddressByVM();

    if (!currentAddress) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    const prov = await this.networkService.getAvalanceProviderXP();
    const txBuff = Buffer.from(unsignedTx.toBytes());
    const txData = await parseAvalancheTx(txBuff, vm, prov, currentAddress);

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
    onError,
    frontendTabId?: number
  ) => {
    try {
      const {
        params,
        displayData: { vm, unsignedTxJson },
      } = pendingAction;
      const [, externalIndices, internalIndices] = params ?? [];

      // We need to know if transaction is on C or X/P, the generated tx object is slightly different for C
      // EVM in Avalanche context means the CoreEth layer.
      const chainAlias = vm === 'EVM' ? 'C' : 'X';

      // Parse the json into a tx object
      const unsignedTx =
        chainAlias === 'C'
          ? EVMUnsignedTx.fromJSON(unsignedTxJson)
          : UnsignedTx.fromJSON(unsignedTxJson);

      const hasMultipleAddresses =
        unsignedTx.addressMaps.getAddresses().length > 1;

      if (
        hasMultipleAddresses &&
        !(externalIndices ?? []).length &&
        !(internalIndices ?? []).length
      ) {
        throw new Error(
          'Transaction contains multiple addresses, but indices were not provided'
        );
      }

      // Sign the transaction and return signature
      const signedTransactionHex = await this.walletService.sign(
        {
          tx: unsignedTx,
          externalIndices,
          internalIndices,
        },
        frontendTabId,
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP()
      );

      // Submit the transaction and return the tx id
      const prov = await this.networkService.getAvalanceProviderXP();
      const res = await prov.issueTxHex(signedTransactionHex, vm);

      onSuccess(res.txID);
    } catch (e) {
      onError(e);
    }
  };
}
