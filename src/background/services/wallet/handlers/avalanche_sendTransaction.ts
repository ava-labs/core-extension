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
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/wallets-sdk';
import getProvidedUtxos from '../utils/getProvidedUtxos';

type TxParams = {
  transactionHex: string;
  chainAlias: 'X' | 'P' | 'C';
  externalIndices?: number[];
  internalIndices?: number[];
  utxos?: string[];
};

@injectable()
export class AvalancheSendTransactionHandler extends DAppRequestHandler<TxParams> {
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

    const {
      transactionHex,
      chainAlias,
      externalIndices,
      internalIndices,
      utxos: providedUtxoHexes,
    } = (request.params ?? {}) as TxParams;

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

    const providedUtxos = getProvidedUtxos({
      utxoHexes: providedUtxoHexes,
      vm,
    });
    const utxos = providedUtxos.length
      ? providedUtxos
      : await Avalanche.getUtxosByTxFromGlacier({
          transactionHex,
          chainAlias,
          isTestnet: !this.networkService.isMainnet(),
          url: process.env.GLACIER_URL as string,
          token: process.env.GLACIER_API_KEY,
        });

    if (vm === EVM) {
      unsignedTx = await Avalanche.createAvalancheEvmUnsignedTx({
        txBytes,
        vm,
        utxos,
        fromAddress: currentAddress,
      });
    } else {
      const tx = utils.unpackWithManager(vm, txBytes) as avaxSerial.AvaxTx;

      const externalAddresses = await this.walletService.getAddressesByIndices(
        externalIndices ?? [],
        chainAlias as 'X' | 'P',
        false
      );

      const internalAddresses = await this.walletService.getAddressesByIndices(
        internalIndices ?? [],
        chainAlias as 'X' | 'P',
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

      unsignedTx = await Avalanche.createAvalancheUnsignedTx({
        tx,
        utxos,
        provider,
        fromAddressBytes,
      });
    }

    const txData = await Avalanche.parseAvalancheTx(
      unsignedTx,
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

    await this.openApprovalWindow(actionData, `approve/avalancheSignTx`);

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

      const { txHash, signedTx } = await this.walletService.sign(
        {
          tx: unsignedTx,
          externalIndices,
          internalIndices,
        },
        frontendTabId,
        // Must tell it is avalanche network
        this.networkService.getAvalancheNetworkXP(),
        DAppProviderRequest.AVALANCHE_SEND_TRANSACTION
      );

      if (typeof txHash === 'string') {
        // If we already have the transaction hash (i.e. it was dispatched by WalletConnect),
        // we just return it to the caller.
        onSuccess(txHash);
      } else if (typeof signedTx === 'string') {
        const signedTransaction =
          vm === EVM
            ? EVMUnsignedTx.fromJSON(signedTx)
            : UnsignedTx.fromJSON(signedTx);

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
      }
    } catch (e) {
      onError(e);
    }
  };
}
