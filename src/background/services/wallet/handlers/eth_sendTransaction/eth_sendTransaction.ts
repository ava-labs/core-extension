import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { injectable } from 'tsyringe';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { ethErrors } from 'eth-rpc-errors';
import { Action } from '@src/background/services/actions/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import getTargetNetworkForTx from './utils/getTargetNetworkForTx';
import {
  ContractTransaction,
  JsonRpcApiProvider,
  Result,
  TransactionDescription,
} from 'ethers';
import {
  EthSendTransactionParams,
  EthSendTransactionParamsWithGas,
  Transaction,
  TransactionDisplayValues,
  isTxParams,
} from './models';
import { NetworkFeeService } from '@src/background/services/networkFee/NetworkFeeService';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { TokenManagerService } from '@src/background/services/tokens/TokenManagerService';
import { parseWithERC20Abi } from './contracts/contractParsers/parseWithERC20Abi';
import { getTxDescription } from './utils/getTxDescription';
import { ContractParserHandler } from './contracts/contractParsers/models';
import { contractParserMap } from './contracts/contractParsers/contractParserMap';
import { parseBasicDisplayValues } from './contracts/contractParsers/utils/parseBasicDisplayValues';
import browser, { runtime } from 'webextension-polyfill';
import { getExplorerAddressByNetwork } from '@src/utils/getExplorerAddress';
import { txToCustomEvmTx } from './utils/txToCustomEvmTx';
import { WalletService } from '@src/background/services/wallet/WalletService';
import { JsonRpcBatchInternal } from '@avalabs/core-wallets-sdk';
import { AnalyticsServicePosthog } from '@src/background/services/analytics/AnalyticsServicePosthog';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { BlockaidService } from '@src/background/services/blockaid/BlockaidService';
import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { EnsureDefined } from '@src/background/models';
import { caipToChainId } from '@src/utils/caipConversion';
import { TxDisplayOptions } from '../models';
import { measureDuration } from '@src/utils/measureDuration';
import { noop } from '@src/utils/noop';
import { NetworkWithCaipId } from '@src/background/services/network/models';
import { LockService } from '@src/background/services/lock/LockService';

type TxPayload = EthSendTransactionParams | ContractTransaction;
type Params = [TxPayload] | [TxPayload, TxDisplayOptions];

@injectable()
export class EthSendTransactionHandler extends DAppRequestHandler<
  Params,
  string
> {
  methods = [DAppProviderRequest.ETH_SEND_TX];

  constructor(
    private networkService: NetworkService,
    private networkFeeService: NetworkFeeService,
    private accountsService: AccountsService,
    private balancesService: BalanceAggregatorService,
    private tokenManagerService: TokenManagerService,
    private walletService: WalletService,
    private analyticsServicePosthog: AnalyticsServicePosthog,
    private blockaidService: BlockaidService,
    private lockService: LockService
  ) {
    super();
  }

  handleUnauthenticated = async ({ request }) => {
    return {
      ...request,
      error: ethErrors.provider.unauthorized(),
    };
  };

  handleAuthenticated = async ({
    request,
    scope,
  }: JsonRpcRequestParams<DAppProviderRequest, Params>) => {
    const { params, site } = request;

    const rawParams = (params || [])[0] as EthSendTransactionParams;
    const displayOptions = params[1];

    // Only the extension UI is allowed to suggest custom display options
    if (displayOptions && site?.domain !== runtime.id) {
      throw new Error('Unauthorized use of display options');
    }

    const trxParams = {
      ...rawParams,
      chainId: rawParams.chainId ?? `0x${caipToChainId(scope).toString(16)}`,
    };
    const network = await getTargetNetworkForTx(
      trxParams,
      this.networkService,
      scope
    );

    if (!network) {
      throw Error('no network selected');
    }

    const provider = getProviderForNetwork(network, true);
    if (!provider || !(provider instanceof JsonRpcApiProvider)) {
      throw Error('provider not available');
    }

    if (!trxParams || !isTxParams(trxParams)) {
      throw new Error('invalid transaction data');
    }

    const txPayload = await this.#addGasInformation(network, trxParams);

    if (this.accountsService.activeAccount) {
      await this.balancesService.getBalancesForNetworks(
        [network.chainId],
        [this.accountsService.activeAccount]
      );
    }

    let displayValues: TransactionDisplayValues | undefined = undefined;

    // order of parsing a transaction:
    // 1. use TX pre execution if available
    // 2. if not, check if toAddress is a known ERC20 token
    // 3. if not, use default basic approval data
    try {
      displayValues = await this.blockaidService.parseTransaction(
        site?.domain || '',
        network,
        txPayload
      );
    } catch (e) {
      // Blockaid parsing failed, try ERC20 parsing next
    }

    // if debank parsing failed check if toAddress is a known ERC20
    if (!displayValues && txPayload.to) {
      const erc20Tokens = await this.tokenManagerService.getTokensByChainId(
        network.chainId
      );
      const lowerCaseAddress = txPayload.to.toLowerCase();
      const erc20Token = erc20Tokens.find(
        (t) => t.address.toLowerCase() === lowerCaseAddress
      );
      if (erc20Token) {
        try {
          displayValues = parseWithERC20Abi(txPayload, erc20Token);
        } catch (e) {
          // ERC20 parsing failed fall back to local ABI parsers
        }
      }
    }

    // if debank and ERC20 parsing failed attempt to use ABI parsing
    if (!displayValues) {
      // the toAddress is empty for contract deployments
      const txDescription: TransactionDescription | null =
        await getTxDescription(network, provider, trxParams);

      const decodedData: Result | undefined = txDescription?.args;
      const parser: ContractParserHandler | undefined = contractParserMap.get(
        txDescription?.name ?? ''
      );

      try {
        displayValues = parser
          ? await parser(network, txPayload, decodedData, txDescription)
          : await parseBasicDisplayValues(network, txPayload, txDescription);
      } catch (err) {
        displayValues = await parseBasicDisplayValues(
          network,
          txPayload,
          txDescription
        );
      }
    }

    const actionData: Action<Transaction> = {
      ...request,
      scope,
      displayData: {
        site,
        method: request.method,
        chainId: network.chainId.toString(),
        txParams: txPayload,
        displayValues,
        displayOptions,
      },
    };

    await openApprovalWindow(actionData, `sign/transaction`);

    return { ...request, result: DEFERRED_RESPONSE };
  };

  onActionApproved = async (
    pendingAction: Action<Transaction>,
    result: any,
    onSuccess: (result: unknown) => Promise<void>,
    onError: (error: Error) => Promise<void>,
    tabId?: number | undefined
  ) => {
    const measurement = measureDuration();
    measurement.start();

    try {
      const network = await getTargetNetworkForTx(
        pendingAction.displayData.txParams,
        this.networkService,
        pendingAction.scope
      );
      console.log('network: ', network);

      const calculatedFee = await this.networkFeeService.getNetworkFee(network);
      console.log('calculatedFee: ', calculatedFee);

      if (!network) {
        throw new Error('network not found');
      }

      const provider = getProviderForNetwork(network) as JsonRpcBatchInternal;

      const nonce = await provider.getTransactionCount(
        pendingAction.displayData.txParams.from
      );
      const chainId = pendingAction.displayData.chainId;

      const {
        maxFeePerGas,
        maxPriorityFeePerGas,
        gasLimit,
        data,
        to,
        value,
        type,
      } = txToCustomEvmTx(pendingAction.displayData.txParams, calculatedFee);

      const signingResult = await this.walletService.sign(
        {
          nonce,
          chainId: Number(BigInt(chainId)),
          maxFeePerGas,
          maxPriorityFeePerGas,
          gasLimit: gasLimit,
          data: data,
          to: to,
          value: value,
          type,
        },
        network,
        tabId
      );

      const txHash = await this.networkService.sendTransaction(
        signingResult,
        network
      );

      const notificationId = crypto.randomUUID();

      await this.#createTxNotification(
        notificationId,
        {
          type: 'basic',
          iconUrl: '../../../../images/icon-32.png',
          title: 'Pending transaction',
          message: `Transaction pending! View on the explorer.`,
          priority: 2,
        },
        network,
        txHash
      );

      provider
        .waitForTransaction(txHash)
        .then(async (tx) => {
          const duration = measurement.end();

          const isTxSuccessul = tx?.status === 1;
          await browser.notifications.clear(notificationId); // close transaction pending notification
          if (!this.lockService.locked) {
            await this.#createTxNotification(
              crypto.randomUUID(),
              {
                type: 'basic',
                iconUrl: '../../../../images/icon-32.png',
                title: isTxSuccessul
                  ? 'Confirmed transaction'
                  : 'Failed transaction',
                message: `Transaction ${
                  isTxSuccessul ? 'confirmed' : 'failed'
                }! View on the explorer.`,
                priority: 2,
              },
              network,
              txHash
            );
          }

          this.analyticsServicePosthog.captureEncryptedEvent({
            name: 'TransactionTimeToConfirmation',
            windowId: crypto.randomUUID(),
            properties: {
              duration,
              txType: pendingAction.displayData.method,
              chainId,
              success: isTxSuccessul,
              rpcUrl: network.rpcUrl,
              site: pendingAction.displayData.site?.domain,
            },
          });
        })
        .catch(noop);

      // No need to await the request here.
      this.analyticsServicePosthog.captureEncryptedEvent({
        name: 'transactionSuccessful',
        windowId: crypto.randomUUID(),
        properties: {
          address: this.accountsService.activeAccount?.addressC,
          txHash,
          method: pendingAction.method,
          chainId,
        },
      });

      onSuccess(txHash);
    } catch (err: any) {
      // Stop and clean up measurement
      // Some error happened during transaction creation, no need to measure end-to-end time till confirmation
      measurement.end();
      const errorMessage: string =
        err instanceof Error ? err.message : err.toString();

      await browser.notifications.create({
        type: 'basic',
        iconUrl: '../../../../images/icon-32.png',
        title: 'Failed transaction',
        message: `Transaction failed! ${errorMessage}`,
        priority: 2,
      });

      // No need to await the request here.
      this.analyticsServicePosthog.captureEncryptedEvent({
        name: 'transactionFailed',
        windowId: crypto.randomUUID(),
        properties: {
          address: this.accountsService.activeAccount?.addressC,
          txHash: undefined,
          method: pendingAction.method,
          chainId: pendingAction.displayData.chainId,
        },
      });

      onError(err);
    }
  };

  async #createTxNotification(
    notificationId: string,
    notificationParams: browser.Notifications.CreateNotificationOptions,
    network: NetworkWithCaipId,
    txHash: string
  ) {
    await browser.notifications.create(notificationId, notificationParams);

    const openTab = async (id: string) => {
      if (id === notificationId) {
        const explorerUrl = getExplorerAddressByNetwork(network, txHash);
        await browser.tabs.create({ url: explorerUrl });
      }
    };

    browser.notifications.onClicked.addListener(openTab);
    browser.notifications.onClosed.addListener((id: string) => {
      if (id === notificationId) {
        browser.notifications.onClicked.removeListener(openTab);
      }
    });

    /*
        notifications.onClosed is only triggered when a user close the notification.
        And the notification is automatically closed 5 secs if user does not close it.
        To mimic onClosed for system, using setTimeout.
      */
    setTimeout(async () => {
      browser.notifications.onClicked.removeListener(openTab);
      await browser.notifications.clear(notificationId);
    }, 5000);
  }

  async #addGasInformation(
    network: NetworkWithCaipId,
    tx: EnsureDefined<EthSendTransactionParams, 'chainId'>
  ): Promise<EnsureDefined<EthSendTransactionParamsWithGas, 'chainId'>> {
    const fees = await this.networkFeeService.getNetworkFee(network);
    const maxFeePerGas = fees?.low.maxFeePerGas ?? 0n;
    const maxPriorityFeePerGas = fees?.low.maxPriorityFeePerGas
      ? BigInt(fees?.low.maxPriorityFeePerGas)
      : undefined;
    const typeFromPayload = tx.maxFeePerGas ? 2 : 0;

    let gasLimit: string;

    if (!tx.gasLimit) {
      try {
        const gasLimitEstimation = await (tx.gas
          ? BigInt(tx.gas)
          : this.networkFeeService.estimateGasLimit(
              tx.from,
              tx.to ?? '',
              tx.data as string,
              network,
              tx.value ? BigInt(tx.value) : undefined
            ));

        // we should always be able to calculate gas limit. If we don't have the limit the TX would fail anyways
        if (!gasLimitEstimation) {
          throw new Error('Unable to calculate gas limit');
        }

        gasLimit = `0x${gasLimitEstimation.toString(16)}`;
      } catch (e: any) {
        // handle gas estimation erros with the correct error message
        if (e.error?.error) {
          throw e.error.error;
        }
        throw e;
      }
    } else {
      gasLimit = tx.gasLimit;
    }

    return {
      ...tx,
      /**
       * We use EIP-1559 market fees (maxFeePerGas/maxPriorityFeePerGas),
       * and they require `type` to be set accordingly (to a value of 2).
       *
       * If the transaction payload explicitly sets a higher `type`,
       * we won't change it hoping it's still backwards-compatible.
       *
       * At the moment of writing this comment, "2" is the highest tx type available.
       */
      type: Math.max(typeFromPayload, 2),
      maxFeePerGas: tx.maxFeePerGas
        ? tx.maxFeePerGas
        : `0x${maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? tx.maxPriorityFeePerGas
        : `0x${maxPriorityFeePerGas?.toString(16)}`,
      gasLimit,
    };
  }
}
