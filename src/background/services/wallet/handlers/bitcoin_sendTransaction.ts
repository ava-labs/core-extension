import { injectable } from 'tsyringe';
import { WalletService } from '../WalletService';
import {
  DAppProviderRequest,
  JsonRpcRequestParams,
} from '@src/background/connections/dAppConnection/models';
import { DAppRequestHandler } from '@src/background/connections/dAppConnection/DAppRequestHandler';
import { Action } from '../../actions/models';
import { DEFERRED_RESPONSE } from '@src/background/connections/middlewares/models';
import { NetworkService } from '@src/background/services/network/NetworkService';
import { AnalyticsServicePosthog } from '@src/background/services/analytics/AnalyticsServicePosthog';
import { ethErrors } from 'eth-rpc-errors';
import {
  DisplayData_BitcoinSendTx,
  TxDisplayOptions,
} from '@src/background/services/wallet/handlers/models';
import { AccountsService } from '@src/background/services/accounts/AccountsService';
import { ChainId } from '@avalabs/core-chains-sdk';
import { BalanceAggregatorService } from '@src/background/services/balances/BalanceAggregatorService';
import { Account, WalletConnectAccount } from '../../accounts/models';
import { BitcoinProvider } from '@avalabs/core-wallets-sdk';
import { TokenWithBalanceBTC } from '../../balances/models';
import { BtcSendOptions } from '@src/pages/Send/models';
import { getProviderForNetwork } from '@src/utils/network/getProviderForNetwork';
import { EnsureDefined } from '@src/background/models';
import { isWalletConnectAccount } from '../../accounts/utils/typeGuards';
import {
  buildBtcTx,
  getBtcInputUtxos,
  validateBtcSend,
} from '@src/utils/send/btcSendUtils';
import { SendErrorMessage } from '@src/utils/send/models';
import { resolve } from '@avalabs/core-utils-sdk';

import { openApprovalWindow } from '@src/background/runtime/openApprovalWindow';
import { runtime } from 'webextension-polyfill';
import { measureDuration } from '@src/utils/measureDuration';
import { noop } from '@src/utils/noop';

type BitcoinTxParams = [
  address: string,
  amount: string,
  feeRate: number,
  displayOptions?: TxDisplayOptions
];

@injectable()
export class BitcoinSendTransactionHandler extends DAppRequestHandler<
  BitcoinTxParams,
  string
> {
  methods = [DAppProviderRequest.BITCOIN_SEND_TRANSACTION];

  constructor(
    private walletService: WalletService,
    private networkService: NetworkService,
    private accountService: AccountsService,
    private balanceAggregatorService: BalanceAggregatorService,
    private analyticsServicePosthog: AnalyticsServicePosthog
  ) {
    super();
  }

  #getRpcErrorMessage = (error: SendErrorMessage) => {
    switch (error) {
      case SendErrorMessage.ADDRESS_REQUIRED:
        return 'Missing address';

      case SendErrorMessage.AMOUNT_REQUIRED:
        return 'Missing amount';

      case SendErrorMessage.INVALID_NETWORK_FEE:
        return 'Missing fee rate';

      case SendErrorMessage.INVALID_ADDRESS:
        return 'Not a valid address.';

      default:
        return 'Unable to construct the transaction.';
    }
  };

  #getBalance = async (
    account: EnsureDefined<Account, 'addressBTC'>
  ): Promise<TokenWithBalanceBTC | undefined> => {
    const btcChainID = this.networkService.isMainnet()
      ? ChainId.BITCOIN
      : ChainId.BITCOIN_TESTNET;

    // Refresh UTXOs before to ensure that UTXOs is updated
    const balances = await this.balanceAggregatorService.getBalancesForNetworks(
      [btcChainID],
      [account]
    );

    const balance = balances[btcChainID]?.[account.addressBTC]?.['BTC'];

    if (balance) {
      return balance as TokenWithBalanceBTC;
    }
  };

  #isSupportedAccount(
    account?: Account
  ): account is EnsureDefined<
    Exclude<Account, WalletConnectAccount>,
    'addressBTC'
  > {
    if (!account) {
      return false;
    }

    if (isWalletConnectAccount(account)) {
      return false;
    }

    return Boolean(account.addressBTC);
  }

  handleAuthenticated = async ({
    request,
    scope,
  }: JsonRpcRequestParams<DAppProviderRequest, BitcoinTxParams>) => {
    if (!this.accountService.activeAccount) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'No active account found',
        }),
      };
    }

    if (!this.#isSupportedAccount(this.accountService.activeAccount)) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'The active account does not support BTC transactions',
        }),
      };
    }

    const [address, amount, feeRate, displayOptions] = (request.params ??
      []) as BitcoinTxParams;
    const isMainnet = this.networkService.isMainnet();
    const token = await this.#getBalance(
      this.accountService.activeAccount as EnsureDefined<Account, 'addressBTC'>
    );

    // Only the extension UI is allowed to suggest custom display options
    if (displayOptions && request.site?.domain !== runtime.id) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Unauthorized use of display options',
        }),
      };
    }

    if (!token) {
      return {
        ...request,
        error: ethErrors.rpc.internal({
          message: 'Unknown balance for BTC',
        }),
      };
    }

    const [network, networkError] = await resolve(
      this.networkService.getBitcoinNetwork()
    );
    if (networkError || !network) {
      return {
        ...request,
        error: ethErrors.rpc.internal({
          message: 'Bitcoin network not found',
        }),
      };
    }
    const provider = getProviderForNetwork(network) as BitcoinProvider;
    const utxos = await getBtcInputUtxos(provider, token, feeRate);

    const from = this.accountService.activeAccount.addressBTC;
    const validationError = validateBtcSend(
      from,
      {
        address,
        amount: Number(amount),
        feeRate,
        token,
      } as BtcSendOptions,
      utxos,
      isMainnet
    );

    if (validationError) {
      return {
        ...request,
        error: ethErrors.rpc.invalidParams({
          message: this.#getRpcErrorMessage(validationError),
        }),
      };
    }

    try {
      const { fee: sendFee } = await buildBtcTx(
        this.accountService.activeAccount.addressBTC,
        provider,
        {
          amount: Number(amount),
          feeRate,
          address,
          token,
        }
      );

      const displayData: DisplayData_BitcoinSendTx = {
        from: this.accountService.activeAccount.addressBTC,
        address,
        amount: Number(amount),
        sendFee,
        feeRate,
        balance: token,
        displayOptions,
      };

      const actionData = {
        ...request,
        scope,
        displayData,
      };

      await openApprovalWindow(actionData, `approve/bitcoinSignTx`);
    } catch (err) {
      return {
        ...request,
        error: ethErrors.rpc.invalidRequest({
          message: 'Unable to construct the transaction.',
        }),
      };
    }

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

  onActionApproved = async (
    pendingAction: Action<DisplayData_BitcoinSendTx>,
    _result,
    onSuccess,
    onError,
    frontendTabId?: number
  ) => {
    const measurement = measureDuration();
    measurement.start();
    try {
      const { address, amount, from, feeRate, balance } =
        pendingAction.displayData;
      const btcChainID = this.networkService.isMainnet()
        ? ChainId.BITCOIN
        : ChainId.BITCOIN_TESTNET;

      const [network, networkError] = await resolve(
        this.networkService.getBitcoinNetwork()
      );
      if (networkError || !network) {
        throw new Error('Bitcoin network not found');
      }

      const provider = getProviderForNetwork(network) as BitcoinProvider;

      const { inputs, outputs } = await buildBtcTx(from, provider, {
        amount,
        address,
        token: balance,
        feeRate,
      });

      if (!inputs || !outputs) {
        throw new Error('Unable to create transaction');
      }

      const result = await this.walletService.sign(
        { inputs, outputs },
        network,
        frontendTabId
      );

      const hash = await this.networkService.sendTransaction(result, network);

      // Refresh UTXOs
      if (this.#isSupportedAccount(this.accountService.activeAccount)) {
        this.#getBalance(this.accountService.activeAccount);
      }

      onSuccess(hash);

      provider
        .waitForTx(hash)
        .then(() => {
          const duration = measurement.end();
          this.analyticsServicePosthog.captureEncryptedEvent({
            name: 'TransactionTimeToConfirmation',
            windowId: crypto.randomUUID(),
            properties: {
              duration,
              txType: 'txType',
              chainId: btcChainID,
              site: pendingAction.site?.domain,
              rpcUrl: network.rpcUrl,
            },
          });
        })
        .catch(noop);
    } catch (e) {
      // clean up pending measurement
      measurement.end();
      onError(e);
    }
  };
}
