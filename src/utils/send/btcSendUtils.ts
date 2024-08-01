import {
  BitcoinInputUTXO,
  BitcoinProvider,
  createTransferTx,
  getMaxTransferAmount,
} from '@avalabs/core-wallets-sdk';
import { inputBytes } from 'coinselect/utils';

import { BtcSendOptions } from '@src/pages/Send/models';
import { TokenWithBalanceBTC } from '@src/background/services/balances/models';

import { isBtcAddressInNetwork } from '../isBtcAddressInNetwork';
import { SendErrorMessage } from './models';

export const getBtcInputUtxos = async (
  provider: BitcoinProvider,
  token: TokenWithBalanceBTC,
  feeRate?: number
) => {
  const utxos = await provider.getScriptsForUtxos(token.utxos ?? []);

  if (typeof feeRate === 'number') {
    // Filter out UTXOs that would not be used with the current fee rate,
    // that is those for which fee to use the UTXO would be higher than its value.
    return utxos.filter((utxo) => {
      const utxoFee = inputBytes(utxo) * feeRate;

      return utxoFee < utxo.value;
    });
  }

  return utxos;
};

export const buildBtcTx = async (
  from: string,
  provider: BitcoinProvider,
  { amount, address, token, feeRate }: BtcSendOptions
) => {
  const utxos = await getBtcInputUtxos(provider, token);

  return createTransferTx(
    address,
    from,
    amount,
    feeRate,
    utxos,
    provider.getNetwork()
  );
};

export const validateBtcSend = (
  from: string,
  { address, amount, feeRate }: BtcSendOptions,
  utxos: BitcoinInputUTXO[],
  isMainnet: boolean
) => {
  if (!address) {
    return SendErrorMessage.ADDRESS_REQUIRED;
  }

  if (!feeRate) {
    return SendErrorMessage.INVALID_NETWORK_FEE;
  }

  if (!isBtcAddressInNetwork(address, isMainnet)) {
    return SendErrorMessage.INVALID_ADDRESS;
  }

  if (!amount || amount <= 0) {
    return SendErrorMessage.AMOUNT_REQUIRED;
  }

  const maxTransferAmount = Math.max(
    getMaxTransferAmount(utxos, address, from, feeRate),
    0
  );

  if (amount > maxTransferAmount) {
    return SendErrorMessage.INSUFFICIENT_BALANCE;
  }

  return null;
};
