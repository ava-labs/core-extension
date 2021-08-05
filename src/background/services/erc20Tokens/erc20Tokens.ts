import { fromEventPattern, mergeMap, mapTo, switchMap } from 'rxjs';
import { Network, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { combineTokensAndBalances, FUJI_LIST, MAINNET_LIST } from './utils';
import { getNetworkFromStorage } from '../network/storage';
import { wallet } from '../wallet/wallet';

async function getTokensAndBalances(wallet: WalletType) {
  const network = await getNetworkFromStorage();

  const tokenIndex = await (Network.isFujiNetwork(network.config)
    ? FUJI_LIST
    : MAINNET_LIST);

  return await combineTokensAndBalances(wallet, tokenIndex);
}

export const erc20TokenList = wallet.pipe(
  switchMap((wallet) => {
    return fromEventPattern(
      (handler) => wallet.on('balanceChangedC', handler),
      (handler) => wallet.off('balanceChangedC', handler)
    ).pipe(mapTo(wallet));
  }),
  switchMap((wallet) => getTokensAndBalances(wallet))
);
