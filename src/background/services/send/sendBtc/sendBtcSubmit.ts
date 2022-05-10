import { Big } from '@avalabs/avalanche-wallet-sdk';
import { btcToSatoshi } from '@avalabs/bridge-sdk';
import { BitcoinInputUTXO, BitcoinWallet } from '@avalabs/wallets-sdk';
import { TokenWithBalance } from '../../balances/models';
import { validateSendBtcValues } from './validateSendBtcValues';

export async function sendBtcSubmit(
  toAddress: string,
  amountStr: string,
  balance: number,
  utxos: BitcoinInputUTXO[],
  feeRate: number,
  token: TokenWithBalance,
  wallet: BitcoinWallet,
  isMainnet: boolean
): Promise<{ txId?: string }> {
  const state = await validateSendBtcValues(
    {
      amount: amountStr,
      address: toAddress,
      token,
    },
    balance,
    utxos,
    feeRate,
    wallet,
    isMainnet
  );

  if (state.error?.error) {
    throw new Error(state.error.message);
  }

  if (!state.canSubmit) {
    throw new Error('Unknown error, unable to submit');
  }

  const amountInSatoshis = btcToSatoshi(new Big(amountStr));

  const { psbt } = wallet.createTransferTx(
    toAddress,
    amountInSatoshis,
    feeRate,
    utxos
  );

  if (!psbt) {
    throw new Error('Unable to create transaction');
  }

  const signedTx = wallet.signPsbt(psbt);
  const result = await wallet.getProvider().issueRawTx(signedTx.toHex());

  return { txId: result.hash };
}
