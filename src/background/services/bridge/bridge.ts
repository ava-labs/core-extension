import { BridgeTransaction } from '@avalabs/bridge-sdk';
import { resolve } from '@src/utils/promiseResolver';
import {
  BehaviorSubject,
  delay,
  filter,
  firstValueFrom,
  switchMap,
} from 'rxjs';
import { storageKey$ } from '../wallet/storageKey';
import { getBridgeConfig } from './handlers/getBridgeConfig';
import { BridgeState } from './models';
import { getBridgeStateFromStorage, saveBridgeStateToStorage } from './storage';
import { trackBridgeTransaction } from './trackBridgeTransaction';

export const defaultBridgeState: BridgeState = {
  bridgeTransactions: {},
};

export const bridge$ = new BehaviorSubject<BridgeState>(defaultBridgeState);

// Init from storage
storageKey$
  .pipe(
    filter((ready) => !!ready),
    switchMap(() => getBridgeStateFromStorage()),
    // Wait for network$ to be initialized (for getBridgeConfig)
    delay(3000)
  )
  .subscribe(async (state) => {
    if (!state) return;

    // Ensure there is a bridge config available
    const { config } = await getBridgeConfig();
    if (!config) throw new Error('missing bridge config');

    // Re-start tx confirmation listeners
    Object.values(state.bridgeTransactions).forEach((bridgeTransaction) => {
      trackBridgeTransaction(bridgeTransaction, config);
    });

    bridge$.next(state);
  });

export async function saveBridgeTransaction(
  bridgeTransaction: BridgeTransaction
) {
  const bridgeState = await firstValueFrom(bridge$);
  const bridgeTransactions = bridgeState.bridgeTransactions;

  const nextBridgeState = {
    ...bridgeState,
    bridgeTransactions: {
      ...bridgeTransactions,
      [bridgeTransaction.sourceTxHash]: bridgeTransaction,
    },
  };
  const [, error] = await resolve(saveBridgeStateToStorage(nextBridgeState));
  bridge$.next(nextBridgeState);

  return error;
}

export async function removeBridgeTransaction(sourceTxHash: string) {
  const bridgeState = await firstValueFrom(bridge$);
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [sourceTxHash]: _removed,
    ...bridgeTransactions
  } = bridgeState.bridgeTransactions;

  const nextBridgeState = { ...bridgeState, bridgeTransactions };
  const [, error] = await resolve(saveBridgeStateToStorage(nextBridgeState));
  bridge$.next(nextBridgeState);

  return error;
}
