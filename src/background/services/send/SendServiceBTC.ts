import { isBech32AddressInNetwork } from '@avalabs/bridge-sdk';
import { ChainId } from '@avalabs/chains-sdk';
import {
  BitcoinInputUTXO,
  BitcoinOutputUTXO,
  createTransferTx,
} from '@avalabs/wallets-sdk';
import BN from 'bn.js';
import { singleton } from 'tsyringe';
import { AccountsService } from '../accounts/AccountsService';
import { NetworkBalanceAggregatorService } from '../balances/NetworkBalanceAggregatorService';
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
    private networkBalancesService: NetworkBalanceAggregatorService
  ) {}

  async getTransactionRequest(sendState: ValidSendState): Promise<{
    inputs: BitcoinInputUTXO[];
    outputs: BitcoinOutputUTXO[];
  }> {
    const { address: toAddress, amount } = sendState;
    const feeRate = sendState.gasPrice.toNumber();
    const provider = await this.networkService.getBitcoinProvider();
    const { utxos } = await this.getBalance();

    const { inputs, outputs } = createTransferTx(
      toAddress,
      this.address,
      amount.toNumber(),
      feeRate,
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
    const { amount, address } = sendState;
    const feeRate = sendState.gasPrice?.toNumber();
    const toAddress = address || this.address; // in case address from form is blank
    const amountInSatoshis = amount?.toNumber() || 0;
    const { balance, utxos } = await this.getBalance();
    const provider = await this.networkService.getBitcoinProvider();
    const isMainnet = await this.networkService.isMainnet();

    const { fee: maxFee } = createTransferTx(
      toAddress,
      this.address,
      balance,
      feeRate || 0,
      utxos,
      provider.getNetwork()
    );
    let maxAmount = maxFee ? balance - maxFee : 0;
    if (maxAmount < 0) {
      maxAmount = 0;
    }

    const { fee, psbt } = createTransferTx(
      toAddress,
      this.address,
      amountInSatoshis,
      feeRate || 0,
      utxos,
      provider.getNetwork()
    );

    const newState: SendState = {
      ...sendState,
      canSubmit: true,
      loading: !maxAmount || typeof feeRate === 'undefined',
      error: undefined,
      maxAmount: new BN(maxAmount),
      sendFee: new BN(fee),
    };

    if (!toAddress)
      return this.getErrorState(newState, SendErrorMessage.ADDRESS_REQUIRED);

    if (toAddress && !isBech32AddressInNetwork(toAddress, isMainnet))
      return this.getErrorState(newState, SendErrorMessage.INVALID_ADDRESS);

    if (!feeRate)
      return this.getErrorState(newState, SendErrorMessage.INVALID_NETWORK_FEE);

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
    return this.accountsService.activeAccount.addressBTC;
  }

  private async getBalance(): Promise<{
    balance: number;
    utxos: BitcoinInputUTXO[];
  }> {
    const token =
      this.networkBalancesService.balances[
        (await this.networkService.isMainnet())
          ? ChainId.BITCOIN
          : ChainId.BITCOIN_TESTNET
      ]?.[this.address]?.[0];

    return {
      balance: token?.balance.toNumber() || 0,
      utxos: token?.utxos || [],
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
