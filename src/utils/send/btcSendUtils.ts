import {
  BitcoinInputUTXO,
  BitcoinProvider,
  createTransferTx,
  getMaxTransferAmount,
} from '@avalabs/wallets-sdk';

import { BtcSendOptions } from '@src/pages/Send/models';
import { TokenWithBalanceBTC } from '@src/background/services/balances/models';

import { isBtcAddressInNetwork } from '../isBtcAddressInNetwork';
import { SendErrorMessage } from './models';

export const getBtcInputUtxos = async (
  provider: BitcoinProvider,
  token: TokenWithBalanceBTC
) => provider.getScriptsForUtxos(token.utxos ?? []);

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
