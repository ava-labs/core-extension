import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import { DAppProviderRequest } from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { ethErrors } from 'eth-rpc-errors';
import { SendServiceBTC } from '@src/background/services/send/SendServiceBTC';
import { ValidSendState } from '@src/background/services/send/models';
import BN from 'bn.js';
import { BigNumber } from 'ethers';
import { DisplayData_BitcoinSendTx } from '@src/background/services/wallet/handlers/models';
import { BalancesServiceBTC } from '@src/background/services/balances/BalancesServiceBTC';
import { isBtcAddressInNetwork } from '@src/utils/isBtcAddressInNetwork';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { ChainId } from '@avalabs/chains-sdk';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';

@injectable()
export class BitcoinSendTransactionHandler extends DAppRequestHandler {
  methods = [DAppProviderRequest.BITCOIN_SEND_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private balancesServiceBTC: BalancesServiceBTC,
    private accountService: AccountsService,
    private sendServiceBTC: SendServiceBTC,
    private balanceAggregatorService: BalanceAggregatorService
  ) {
    super();
  }

  handleAuthenticated = async (request) => {
    const [address, amountSatoshi, feeRate]: [string?, string?, number?] =
      request.params ?? [];

    // Check inputs
    if (!address) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing address',
        }),
      };
    } else if (!amountSatoshi) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing amount',
        }),
      };
    } else if (!feeRate) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Missing fee rate',
        }),
      };
    }

    // If destination address is not valid, return error
    if (!isBtcAddressInNetwork(address, this.networkService.isMainnet())) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Not a valid address.',
        }),
      };
    }

    if (!this.accountService.activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    const btcChainID = this.networkService.isMainnet()
      ? ChainId.BITCOIN
      : ChainId.BITCOIN_TESTNET;

    // Refresh UTXOs before to ensure that UTXOs is updated
    this.accountService.activeAccount &&
      (await this.balanceAggregatorService.updateBalancesForNetworks(
        [btcChainID],
        [this.accountService.activeAccount]
      ));

    const balance =
      this.balanceAggregatorService.balances[btcChainID]?.[
        this.accountService.activeAccount.addressBTC
      ]?.['BTC'];

    const sendState = {
      address,
      amount: new BN(amountSatoshi),
      maxFeePerGas: BigNumber.from(feeRate),
    };

    const verifiedState =
      (await this.sendServiceBTC.validateStateAndCalculateFees(
        sendState
      )) as ValidSendState;

    // If we cant construct the transaction return error
    if (verifiedState.error?.error) {
      return {
        ...request,
        error: ethErrors.rpc.transactionRejected({
          message: verifiedState.error.message,
        }),
      };
    }

    // If we cant submit the transaction return error
    if (!verifiedState.canSubmit) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: 'Unable to construct the transaction.',
        }),
      };
    }

    const displayData: DisplayData_BitcoinSendTx = {
      sendState: verifiedState,
      balance,
    };

    const actionData = {
      ...request,
      tabId: request.site.tabId,
      displayData,
    };

    await this.openApprovalWindow(
      actionData,
      `approve/bitcoinSignTx?id=${request.id}`
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
      const displayData: DisplayData_BitcoinSendTx = pendingAction.displayData;

      const btcNetwork = await this.networkService.getBitcoinNetwork();

      const txRequest = await this.sendServiceBTC.getTransactionRequest(
        displayData.sendState
      );
      const signed = await this.walletService.sign(
        txRequest,
        frontendTabId,
        btcNetwork
      );
      const result = await this.networkService.sendTransaction(
        signed,
        btcNetwork
      );

      // Refresh UTXOs
      this.accountService.activeAccount &&
        this.balanceAggregatorService.updateBalancesForNetworks(
          [btcNetwork.chainId],
          [this.accountService.activeAccount]
        );
      onSuccess(result);
    } catch (e) {
      onError(e);
    }
  };
}
