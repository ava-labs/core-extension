import {
  fromEventPattern,
  mergeMap,
  mapTo,
  switchMap,
  of,
  concat,
  firstValueFrom,
} from 'rxjs';
import { Network, WalletType } from '@avalabs/avalanche-wallet-sdk';
import { combineTokensAndBalances, FUJI_LIST, MAINNET_LIST } from './utils';
import { wallet } from '../wallet/wallet';
import { walletInitializedFilter } from '../wallet/utils/walletInitializedFilter';
import { network } from '../network/handlers';

async function getTokensAndBalances(wallet: WalletType) {
  const net = await firstValueFrom(network);

  const tokenIndex = await (Network.isFujiNetwork(net.config)
    ? FUJI_LIST
    : MAINNET_LIST);

  return await combineTokensAndBalances(wallet, tokenIndex);
}

export const erc20TokenList = wallet.pipe(
  walletInitializedFilter(),
  switchMap((wallet) => {
    return concat(
      of({}),
      fromEventPattern(
        (handler) => wallet.on('balanceChangedC', handler),
        (handler) => wallet.off('balanceChangedC', handler)
      )
    ).pipe(mapTo(wallet));
  }),
  switchMap((wallet) => getTokensAndBalances(wallet))
);
