import { Big } from '@avalabs/avalanche-wallet-sdk';
import { btcToSatoshi } from '@avalabs/bridge-sdk';
import { BitcoinInputUTXO, createTransferTx } from '@avalabs/wallets-sdk';
import { bitcoin, testnet } from 'bitcoinjs-lib/src/networks';
import { TokenWithBalance } from '../../balances/models';
import { NetworkService } from '../../network/NetworkService';
import { WalletService } from '../../wallet/WalletService';
import { validateSendBtcValues } from './validateSendBtcValues';

export async function sendBtcSubmit(
  toAddress: string,
  changeAddress: string,
  amountStr: string,
  balance: number,
  utxos: BitcoinInputUTXO[],
  feeRate: number,
  token: TokenWithBalance,
  walletService: WalletService,
  networkService: NetworkService
): Promise<{ txId?: string }> {
  const state = await validateSendBtcValues(
    changeAddress,
    {
      amount: amountStr,
      address: toAddress,
      token,
    },
    balance,
    utxos,
    feeRate,
    networkService
  );

  if (state.error?.error) {
    throw new Error(state.error.message);
  }

  if (!state.canSubmit) {
    throw new Error('Unknown error, unable to submit');
  }

  const amountInSatoshis = btcToSatoshi(new Big(amountStr));

  const { inputs, outputs } = createTransferTx(
    toAddress,
    changeAddress,
    amountInSatoshis,
    feeRate,
    utxos,
    (await networkService.isMainnet()) ? bitcoin : testnet
  );

  if (!inputs || !outputs) {
    throw new Error('Unable to create transaction');
  }

  const signedTx = await walletService.sign({ inputs, outputs });
  const result = await networkService.sendTransaction(signedTx);

  return { txId: result };
}
