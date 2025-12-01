import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest, JsonRpcRequestParams } from '@core/types';
import {
  Action,
  buildActionForRequest,
  DAppRequestHandler,
  DEFERRED_RESPONSE,
  NetworkWithCaipId,
} from '@core/types';
import {
  UnsignedTx,
  EVMUnsignedTx,
  EVM,
  utils,
  avaxSerial,
  VM,
} from '@avalabs/avalanchejs';
import { NetworkService } from '../../network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { AccountsService } from '../../accounts/AccountsService';
import getAddressByVM from '../utils/getAddressByVM';
import { Avalanche } from '@avalabs/core-wallets-sdk';
import { Network } from '@avalabs/glacier-sdk';
import getProvidedUtxos from '../utils/getProvidedUtxos';
import { AnalyticsServicePosthog } from '../../analytics/AnalyticsServicePosthog';
import { ChainId } from '@avalabs/core-chains-sdk';
import { isNotNullish, measureDuration } from '@core/common';
import { HEADERS } from '../../glacier/glacierConfig';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { openApprovalWindow } from '~/runtime/openApprovalWindow';

type TxParams = {
  transactionHex: string;
  chainAlias: 'X' | 'P' | 'C';
  externalIndices?: number[];
  internalIndices?: number[];
  utxos?: string[];
  feeTolerance?: number;
};

type AvalancheTxDisplayData = {
  unsignedTxJson: string;
  txData: Avalanche.Tx;
  vm: VM;
};

@injectable()
export class AvalancheSendTransactionHandler extends DAppRequestHandler<
  TxParams,
  string
> {
  methods = [DAppProviderRequest.AVALANCHE_SEND_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountsService: AccountsService,
    private analyticsServicePosthog: AnalyticsServicePosthog,
  ) {
    super();
  }

  handleAuthenticated = async (
    rpcCall: JsonRpcRequestParams<DAppProviderRequest, TxParams>,
  ) => {
    let unsignedTx: UnsignedTx | EVMUnsignedTx;

    const { request, scope } = rpcCall;
    const {
      transactionHex,
      chainAlias,
      externalIndices,
      internalIndices,
      utxos: providedUtxoHexes,
      feeTolerance,
    } = (request.params ?? {}) as TxParams;

    if (!transactionHex || !chainAlias) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing mandatory param(s)',
        }),
      };
    }
    const network = await this.networkService.getAvalancheNetworkXP();
    const vm = Avalanche.getVmByChainAlias(chainAlias);
    const txBytes = utils.hexToBuffer(transactionHex);
    const provider = await this.networkService.getAvalanceProviderXP();
    const activeAccount = await this.accountsService.getActiveAccount();
    const currentAddress = getAddressByVM(vm, activeAccount);

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
          network: network.isTestnet ? Network.FUJI : Network.MAINNET,
          url: process.env.GLACIER_URL as string,
          token: process.env.GLACIER_API_KEY,
          headers: HEADERS,
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
        false,
      );

      const internalAddresses = await this.walletService.getAddressesByIndices(
        internalIndices ?? [],
        chainAlias as 'X' | 'P',
        true,
      );

      const fromAddresses = [
        ...new Set([
          currentAddress,
          ...externalAddresses,
          ...internalAddresses,
        ]),
      ].filter(isNotNullish);

      const fromAddressBytes = fromAddresses.map(
        (address) => utils.parse(address)[2],
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
      currentAddress,
      {
        feeTolerance,
      },
    );

    if (txData.type === 'unknown') {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to parse transaction data. Unsupported tx type',
        }),
      };
    }

    const actionData = buildActionForRequest(request, {
      scope,
      displayData: {
        unsignedTxJson: JSON.stringify(unsignedTx.toJSON()),
        txData,
        vm,
      },
    });

    await openApprovalWindow(actionData, `approve/avalancheSignTx`);

    return {
      ...request,
      result: DEFERRED_RESPONSE,
    };
  };

  handleUnauthenticated = ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  async #getAddressForVM(vm: VM) {
    const account = await this.accountsService.getActiveAccount();

    if (!account) {
      return;
    }

    if (vm === 'EVM') {
      return account.addressC;
    } else if (vm === 'AVM') {
      return account.addressAVM;
    } else if (vm === 'PVM') {
      return account.addressPVM;
    }
  }

  #getChainIdForVM(vm: VM) {
    const isMainnet = this.networkService.isMainnet();

    if (vm === 'EVM') {
      return isMainnet
        ? ChainId.AVALANCHE_MAINNET_ID
        : ChainId.AVALANCHE_TESTNET_ID;
    } else if (vm === 'AVM') {
      return isMainnet ? ChainId.AVALANCHE_X : ChainId.AVALANCHE_TEST_X;
    }

    return isMainnet ? ChainId.AVALANCHE_P : ChainId.AVALANCHE_TEST_P;
  }

  onActionApproved = async (
    pendingAction: Action<AvalancheTxDisplayData>,
    _result,
    onSuccess,
    onError,
    frontendTabId?: number,
  ) => {
    const {
      displayData: { vm, unsignedTxJson },
      params: { externalIndices, internalIndices },
    } = pendingAction;

    const usedAddress = await this.#getAddressForVM(vm);
    const usedNetwork = this.#getChainIdForVM(vm);
    const measurement = measureDuration();
    try {
      measurement.start();
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
          'Transaction contains multiple addresses, but indices were not provided',
        );
      }

      const network: NetworkWithCaipId =
        vm === EVM
          ? {
              ...(await this.networkService.getAvalancheNetwork()),
              vmName: NetworkVMType.CoreEth,
            }
          : await this.networkService.getAvalancheNetworkXP();

      const prov = await this.networkService.getAvalanceProviderXP();
      const { txHash, signedTx } = await this.walletService.sign(
        {
          tx: unsignedTx,
          externalIndices,
          internalIndices,
        },
        network,
        frontendTabId,
        DAppProviderRequest.AVALANCHE_SEND_TRANSACTION,
      );

      let transactionHash: string;
      if (typeof txHash === 'string') {
        transactionHash = txHash;

        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_sendTransaction_success',
          windowId: crypto.randomUUID(),
          properties: {
            address: usedAddress,
            txHash: txHash,
            chainId: usedNetwork,
          },
        });

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
          signedTransaction.getSignedTx(),
        );

        // Submit the transaction and return the tx id
        const res = await prov.issueTxHex(signedTransactionHex, vm);

        this.analyticsServicePosthog.captureEncryptedEvent({
          name: 'avalanche_sendTransaction_success',
          windowId: crypto.randomUUID(),
          properties: {
            address: usedAddress,
            txHash: res.txID,
            chainId: usedNetwork,
          },
        });

        transactionHash = res.txID;

        onSuccess(res.txID);
      } else {
        onError(new Error('Signing error, invalid result'));
        return;
      }

      prov
        .waitForTransaction(transactionHash, vm, 60000)
        .then(() => {
          const duration = measurement.end();
          this.analyticsServicePosthog.captureEncryptedEvent({
            name: 'TransactionTimeToConfirmation',
            windowId: crypto.randomUUID(),
            properties: {
              duration,
              txType: unsignedTx.getTx()._type,
              chainId: usedNetwork,
              rpcUrl: network.rpcUrl,
              site: pendingAction.site?.domain,
            },
          });
        })
        .catch(() => {
          // clean up pending measurement
          measurement.end();
        });
    } catch (e) {
      // clean up pending measurement
      measurement.end();

      this.analyticsServicePosthog.captureEncryptedEvent({
        name: 'avalanche_sendTransaction_failed',
        windowId: crypto.randomUUID(),
        properties: {
          address: usedAddress,
          chainId: usedNetwork,
        },
      });

      onError(e);
    }
  };
}
