import { isBech32AddressInNetwork } from '@avalabs/bridge-sdk';
import { stringToBN } from '@avalabs/utils-sdk';
import { SendState } from '@avalabs/wallet-react-components';
import {
  BitcoinInputUTXO,
  BitcoinProviderAbstract,
  createTransferTx,
} from '@avalabs/wallets-sdk';
import { SetSendValuesParams } from '@src/pages/Send/models';
import { BN } from 'bn.js';
import { NetworkService } from '../../network/NetworkService';
import { WalletService } from '../../wallet/WalletService';

export enum SendBtcError {
  AMOUNT_REQUIRED = 'Amount required',
  ADDRESS_REQUIRED = 'Address required',
  INVALID_ADDRESS = 'Address is invalid',
  INSUFFICIENT_BALANCE = 'Insufficient balance.',
}

export async function validateSendBtcValues(
  changeAddress: string,
  values: SetSendValuesParams,
  balance: number,
  utxos: BitcoinInputUTXO[],
  feeRate: number,
  walletService: WalletService,
  networkService: NetworkService
): Promise<SendState> {
  const { amount: amountStr, address } = values;
  const amountInSatoshis = stringToBN(amountStr || '0', 8);

  let error: string | undefined;

  if (!amountInSatoshis) {
    error = SendBtcError.AMOUNT_REQUIRED;
  }
  if (!address) {
    error = SendBtcError.ADDRESS_REQUIRED;
  }
  if (address && !isBech32AddressInNetwork(address, networkService.isMainnet)) {
    error = SendBtcError.INVALID_ADDRESS;
  }

  const toAddress = address || changeAddress; // in case address from form is blank
  const { fee: maxFee } = createTransferTx(
    toAddress,
    changeAddress,
    balance,
    feeRate,
    utxos,
    networkService.activeProvider as BitcoinProviderAbstract
  );
  let maxAmount = new BN(balance - maxFee);
  if (maxAmount.lt(new BN(0))) {
    maxAmount = new BN(0);
  }

  const { fee, psbt } = createTransferTx(
    toAddress,
    changeAddress,
    amountInSatoshis.toNumber(),
    feeRate,
    utxos,
    networkService.activeProvider as BitcoinProviderAbstract
  );

  if (!psbt && amountInSatoshis.gt(new BN(0))) {
    error = SendBtcError.INSUFFICIENT_BALANCE;
  }

  return {
    canSubmit: !!psbt,
    amount: amountInSatoshis,
    address,
    error: error ? { error: true, message: error } : undefined,
    maxAmount,
    sendFee: new BN(fee),
  };
}
