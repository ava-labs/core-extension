import {
  isBech32AddressInNetwork,
  isBase58AddressInNetwork,
} from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  createTransferTx,
  getMaxTransferAmount as getMaxTransferAmountBTC,
} from '@avalabs/wallets-sdk';
import BN from 'bn.js';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { BalanceAggregatorService } from '../balances/BalanceAggregatorService';
import { NetworkService } from '../network/NetworkService';
import {
  SendErrorMessage,
  SendServiceHelper,
  SendState,
  ValidSendState,
} from './models';

@singleton()
export class SendServiceBTC implements SendServiceHelper {
  constructor(
    private accountsService: AccountsService,
    private networkService: NetworkService,
    private networkBalancesService: BalanceAggregatorService
  ) {}

  async getTransactionRequest(sendState: ValidSendState): Promise<{
    inputs: BitcoinInputUTXO[];
    outputs: BitcoinOutputUTXO[];
  }> {
    const { address: toAddress, amount } = sendState;
    const feeRate = sendState.maxFeePerGas;
    const provider = await this.networkService.getBitcoinProvider();
    const { utxos } = await this.getBalance();

    const { inputs, outputs } = createTransferTx(
      toAddress,
      this.address,
      amount.toNumber(),
      Number(feeRate),
      utxos,
      provider.getNetwork()
    );

    if (!inputs || !outputs) {
      throw new Error('Unable to create transaction');
    }

    return { inputs, outputs };
  }

  async validateStateAndCalculateFees(
    sendState: SendState
  ): Promise<SendState | ValidSendState> {
    const { amount, address: toAddress } = sendState;
    const feeRate = sendState.maxFeePerGas;
    const amountInSatoshis = amount?.toNumber() || 0;
    const { utxos } = await this.getBalance();
    const provider = await this.networkService.getBitcoinProvider();

    // We can't do much until fee rate is given.
    if (!feeRate)
      return this.getErrorState(
        {
          ...sendState,
          loading: true,
        },
        SendErrorMessage.INVALID_NETWORK_FEE
      );

    if (!toAddress)
      return this.getErrorState(
        {
          ...sendState,
          loading: false,
        },
        SendErrorMessage.ADDRESS_REQUIRED
      );

    // Validate the destination address
    const isMainnet = await this.networkService.isMainnet();

    // Verify if its bech32/base58 address on the correct network
    const isAddressValid =
      isBech32AddressInNetwork(toAddress, isMainnet) ||
      isBase58AddressInNetwork(toAddress, isMainnet);

    if (!isAddressValid)
      return this.getErrorState(
        { ...sendState, loading: false, canSubmit: false },
        SendErrorMessage.INVALID_ADDRESS
      );

    // Estimate max send amount based on UTXOs and fee rate
    // Since we are only using bech32 addresses we can use this.address to estimate
    const maxAmount = new BN(
      Math.max(
        getMaxTransferAmountBTC(
          utxos,
          toAddress,
          this.address,
          Number(feeRate)
        ),
        0
      )
    );

    // Try to construct the actual transaction
    const { fee, psbt } = createTransferTx(
      toAddress,
      this.address,
      amountInSatoshis,
      Number(feeRate),
      utxos,
      provider.getNetwork()
    );

    const newState: SendState = {
      ...sendState,
      canSubmit: !!psbt,
      isValidating: false,
      loading: false,
      error: undefined,
      maxAmount,
      sendFee: new BN(fee),
      // The transaction's byte size is for BTC as gasLimit is for EVM.
      // Bitcoin's formula for fee is `transactionByteLength * feeRate`.
      // Since we know the `fee` and the `feeRate`, we can get the transaction's
      // byte length by division.
      gasLimit: Number(BigInt(fee) / feeRate),
    };

    if (!amountInSatoshis)
      return this.getErrorState(newState, SendErrorMessage.AMOUNT_REQUIRED);

    if (!psbt && amountInSatoshis > 0)
      return this.getErrorState(
        newState,
        SendErrorMessage.INSUFFICIENT_BALANCE
      );

    return newState;
  }

  private get address() {
    if (!this.accountsService.activeAccount)
      throw new Error('no active account');

    const { addressBTC } = this.accountsService.activeAccount;

    if (!addressBTC) {
      throw new Error('Active account does not have a BTC address');
    }

    return addressBTC;
  }

  private async getBalance(): Promise<{
    balance: number;
    utxos: BitcoinInputUTXO[];
  }> {
    const provider = await this.networkService.getBitcoinProvider();
    const token =
      this.networkBalancesService.balances[
        this.networkService.isMainnet()
          ? ChainId.BITCOIN
          : ChainId.BITCOIN_TESTNET
      ]?.[this.address]?.['BTC'];

    const utxosWithScripts = await provider.getScriptsForUtxos(
      token?.utxos || []
    );

    return {
      balance: token?.balance.toNumber() || 0,
      utxos: utxosWithScripts,
    };
  }

  private getErrorState(sendState: SendState, errorMessage: string): SendState {
    return {
      ...sendState,
      error: { error: true, message: errorMessage },
      canSubmit: false,
    };
  }
}
