import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
import { AppConfig, issueRawTx, signPsbt } from '@avalabs/bridge-sdk';
import { isMnemonicWallet, wallet$ } from '@avalabs/wallet-react-components';
import {
  ConnectionRequestHandler,
  ExtensionConnectionMessage,
  ExtensionRequest,
} from '@src/background/connections/models';
import * as bitcoin from 'bitcoinjs-lib';
import { firstValueFrom } from 'rxjs';
import { isWalletLocked } from '../../wallet/models';
import { walletState$ } from '../../wallet/walletState';
import { bridgeConfig$ } from '../bridgeConfig';

/**
 * FYI: the input UTXOs to the unsignedTxHex must be owned by the wallet
 * (i.e. the C-chain derived bitcoin address)
 */
async function signAndIssueBtcTx(
  unsignedTxHex: string,
  config: AppConfig,
  wallet: MnemonicWallet
) {
  const psbt = bitcoin.Psbt.fromHex(unsignedTxHex);
  const signedTx = signPsbt(
    wallet.evmWallet.getPrivateKeyHex(),
    psbt
  ).extractTransaction();
  return await issueRawTx(signedTx.toHex(), config);
}

async function signAndIssueBtcTxHandler(request: ExtensionConnectionMessage) {
  const { config } = await firstValueFrom(bridgeConfig$);
  const wallet = await firstValueFrom(wallet$);
  const walletState = await firstValueFrom(walletState$);
  if (!config || !wallet || !walletState || isWalletLocked(walletState))
    return {
      ...request,
      error: 'Not ready',
    };
  if (!isMnemonicWallet(wallet))
    return {
      ...request,
      error: 'Only MnemonicWallet supported',
    };

  const [unsignedTxHex] = request.params || [];

  const result = await signAndIssueBtcTx(unsignedTxHex, config, wallet);

  return {
    ...request,
    result,
  };
}

export const SignAndIssueBtcTxRequest: [
  ExtensionRequest,
  ConnectionRequestHandler
] = [ExtensionRequest.BRIDGE_SIGN_ISSUE_BTC, signAndIssueBtcTxHandler];
