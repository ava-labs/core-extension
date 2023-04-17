import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import {
  UnsignedTx,
  EVMUnsignedTx,
  EVM,
  utils,
  avaxSerial,
} from '@avalabs/avalanchejs-v2';
import { parseAvalancheTx } from '@src/background/services/wallet/utils/parseAvalancheTx';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import createAvalancheEvmUnsignedTx from '../utils/createAvalancheEvmUnsignedTx';
import createAvalancheUnsignedTx from '../utils/createAvalancheUnsignedTx';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/wallets-sdk';

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
    let unsignedTx: UnsignedTx | EVMUnsignedTx;

    const { transactionHex, chainAlias, externalIndices, internalIndices } =
      (request.params ?? {}) as any;

    if (!transactionHex || !chainAlias) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      };
    }

    const vm = Avalanche.getVmByChainAlias(chainAlias);
    const txBytes = utils.hexToBuffer(transactionHex);
    const provider = await this.networkService.getAvalanceProviderXP();
    const currentAddress = getAddressByVM(
      vm,
      this.accountsService.activeAccount
    );

    if (!currentAddress) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    if (vm === EVM) {
      unsignedTx = await createAvalancheEvmUnsignedTx({
        txBytes,
        vm,
        provider,
        fromAddress: currentAddress,
      });
    } else {
      const tx = utils.unpackWithManager(vm, txBytes) as avaxSerial.AvaxTx;

      const externalAddresses = await this.walletService.getAddressesByIndices(
        externalIndices ?? [],
        chainAlias,
        false
      );

      const internalAddresses = await this.walletService.getAddressesByIndices(
        internalIndices ?? [],
        chainAlias,
        true
      );

      const fromAddresses = [
        ...new Set([
          currentAddress,
          ...externalAddresses,
          ...internalAddresses,
        ]),
      ];

      const fromAddressBytes = fromAddresses.map(
        (address) => utils.parse(address)[2]
      );

      unsignedTx = await createAvalancheUnsignedTx({
        tx,
        vm,
        provider,
        fromAddressBytes,
      });
    }

    const txData = await parseAvalancheTx(
      unsignedTx.getTx(),
      provider,
      currentAddress
    );

    if (txData.type === 'unknown') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      };
    }

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData: {
        unsignedTxJson: JSON.stringify(unsignedTx.toJSON()),
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
        displayData: { vm, unsignedTxJson },
        params: { externalIndices, internalIndices },
      } = pendingAction;

      // Parse the json into a tx object
      const unsignedTx =
        vm === EVM
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

      const signedTransactionJson = await this.walletService.sign(
        {
          tx: unsignedTx,
          externalIndices,
          internalIndices,
        },
        frontendTabId,
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP()
      );

      const signedTransaction =
        vm === EVM
          ? EVMUnsignedTx.fromJSON(signedTransactionJson)
          : UnsignedTx.fromJSON(signedTransactionJson);

      if (!signedTransaction.hasAllSignatures()) {
        throw new Error('Signing error, missing signatures.');
      }

      const signedTransactionHex = Avalanche.signedTxToHex(
        signedTransaction.getSignedTx()
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
