import {
  PeerType,
  TransactionOperation,
  TransactionStatus,
} from 'fireblocks-sdk';
import type {
  TransferPeerPath,
  CreateTransactionResponse,
  TransactionDestination,
  TransactionResponse,
  TransactionArguments,
} from 'fireblocks-sdk';
import { wait } from '@avalabs/utils-sdk';
import { satoshiToBtc } from '@avalabs/bridge-sdk';

import { BtcTransactionRequest, SigningResult } from '../wallet/models';
import {
  FireblocksError,
  TRANSACTION_POLLING_INTERVAL_MS,
  TX_SUBMISSION_FAILURE_STATUSES,
} from './models';
import { FireblocksService } from './FireblocksService';

/**
 * Class used to dispatch BTC transactions using Fireblocks API.
 */
export class FireblocksBTCSigner {
  #client: FireblocksService;
  #vaultAccountId: string;
  #isTestnet?: boolean;

  constructor(
    fireblocksService: FireblocksService,
    vaultAccountId: string,
    isTestnet?: boolean
  ) {
    this.#isTestnet = isTestnet;
    this.#vaultAccountId = vaultAccountId;
    this.#client = fireblocksService;
  }

  async signTx(
    inputs: BtcTransactionRequest['inputs'],
    outputs: BtcTransactionRequest['outputs']
  ): Promise<SigningResult> {
    /**
     * TODO: Do we need to handle mutliple inputs? Fireblocks has a way of selecting
     * UTXOs, so maybe not. Unless they need to match exactly what we select for
     * BTC bridge transactions.
     *
     * API reference: https://developers.fireblocks.com/docs/utxo-manual-selection
     */
    const source = this.#getSource(inputs);
    const assetId = this.#isTestnet ? 'BTC_TEST' : 'BTC';
    const destinations = await this.#getDestinations(outputs, assetId);

    /**
     * The externalTxId is for idempotency on the Fireblocks side.
     * It's purpose is to avoid sending the same transaction twice
     * in case there was some interruption in getting the response
     * back from Fireblocks.
     *
     * For example: user is on a train, submits the transaction and
     * enters a tunnel, losing connection.
     *
     * We will receive an error in the response (i.e. request timed out),
     * but in reality it could have succeeded - but we have no way of
     * knowing what the result was.
     *
     * I was thinking about using a hash of the transaction payload +
     * the request timestamp as the external TX id. Then, if the request
     * fails for unknown reasons, we could store both the hash and the
     * timestamp locally.
     *
     * Later on, if we see the user repeating the same transaction within
     * a given timeframe, we can fetch ID of the previous, possibly successful
     * transaction from Fireblocks and check what the result was by calling
     * the API endpoint:
     *
     *   /transactions/external_tx_id/:externalTxId/
     *
     * If such a transaction exists and was submitted sucessfully, we could
     * warn the user that they're about to send an identical transaction.
     *
     * If such a transaction does not exist, or was not submitted successfully,
     * we'd let the user submit the new one without interruptions.
     *
     * For now, just generate a random UUID.
     * TODO: make it not random before going to prod (not critical, but good to have).
     */
    const externalTxId = crypto.randomUUID();

    const body: TransactionArguments = {
      operation: TransactionOperation.TRANSFER,
      externalTxId,
      source,
      assetId,
      destinations,
    };

    await this.#client.request<CreateTransactionResponse>({
      path: '/transactions',
      method: 'POST',
      body,
    });

    // TODO: Emit an event containing a transaction ID, so we can start
    // tracking the transaction status in the background.
    const tx = await this.#waitForTransaction(externalTxId);

    return {
      txHash: tx.txHash,
    };
  }

  #hasTransactionFailed(txStatus: TransactionStatus): boolean {
    return TX_SUBMISSION_FAILURE_STATUSES.includes(txStatus);
  }

  /**
   * TODO: emit success/failure events to finalize the transaction tracking.
   */
  async #waitForTransaction(
    txId: string
  ): Promise<TransactionResponse | never> {
    let continuePolling = true;
    let tx: TransactionResponse;

    do {
      tx = await this.#client.request({
        path: `/transactions/external_tx_id/${txId}`,
        method: 'GET',
      });

      // If we know the transaction was unsucessful, raise an error.
      if (this.#hasTransactionFailed(tx.status)) {
        throw new FireblocksError(
          `Transaction unsuccessful (status: ${tx.status})`
        );
      }

      // If the transaction was not broadcasted, continue polling.
      continuePolling = !tx.txHash;

      if (continuePolling) {
        await wait(TRANSACTION_POLLING_INTERVAL_MS);
      }
    } while (continuePolling);

    return tx;
  }

  async #getDestinations(
    outputs: BtcTransactionRequest['outputs'],
    txAssetId: string
  ): Promise<TransactionDestination[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const knownAddresses = await this.#client.getAllKnownAddressesForAsset(
      txAssetId
    );

    // The last output seems to always be the "rest".
    // We can't have it here - Fireblocks "wants to" add it on its own,
    // otherwise it errors out.
    return outputs
      .slice(0, -1)
      .map<TransactionDestination>(({ value, address }) => {
        // The easiest approach for us would be to use "one time addresses" here,
        // but these are discouraged by Fireblocks and disabled  by default in the
        // Transaction Approval Policies (TAP), as per:
        // https://developers.fireblocks.com/reference/transaction-sources-destinations#one_time_address

        // We need to find a way to map the output addresses to known Fireblocks wallets,
        // so that we're not using ONE_TIME_ADDRESS as destination.type, but rather things like:
        // VAULT_ACCOUNT, EXCHANGE_ACCOUNT, INTERNAL_WALLET, EXTERNAL_WALLET, etc.
        // This way we won't require the one time addresses to be allowed from our users, making
        // the transfers more secure and easier to use (no TAP changes needed).

        return {
          amount: satoshiToBtc(value).toString(),
          destination: knownAddresses.get(address) ?? {
            type: PeerType.ONE_TIME_ADDRESS,
            oneTimeAddress: {
              address,
            },
          },
        };
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  #getSource(inputs: BtcTransactionRequest['inputs']): TransferPeerPath {
    /**
     * NOTE: Should the source be derived from TX inputs in any way?
     *
     * If I understand correctly, Fireblocks will automatically consolidate the UTXOs
     * if we pass the vault account as the source.
     *
     * https://developers.fireblocks.com/docs/utxo-consolidation
     *
     * Also, I think it's expected that the source should always be the account
     * that was imported from Fireblocks, so I think we simply get the account ID & type
     * from the storage and use it here.
     *
     * However, if we do need to handle manual UTXO selection, here's the API reference:
     * https://developers.fireblocks.com/docs/utxo-manual-selection
     */

    return {
      id: this.#vaultAccountId,
      type: PeerType.VAULT_ACCOUNT,
    };
  }
}
