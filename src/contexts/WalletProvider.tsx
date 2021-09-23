import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useConnectionContext } from './ConnectionProvider';
import { LoadingIcon } from '@avalabs/react-components';
import { concat, filter, map } from 'rxjs';
import { BN } from '@avalabs/avalanche-wallet-sdk';
import {
  isWalletLocked,
  WalletLockedState,
  WalletState,
} from '@src/background/services/wallet/models';
import { WalletLocked } from '@src/pages/Wallet/WalletLocked';
import { walletUpdatedEventListener } from '@src/background/services/wallet/events/walletStateUpdatesListener';
import { ExtensionRequest } from '@src/background/connections/models';

const WalletContext = createContext<WalletState>({} as any);

function recastWalletState(state: WalletState) {
  const { balanceAvaxTotal, ...values } = (state as WalletState).balances;

  return {
    ...state,
    ...{
      balances: {
        ...values,
        /**
         * have to cast back to BN since this was serialized over port connection, so ALL BNs have to be
         * recast to BN from hex
         *
         * @link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#data_cloning_algorithm
         *  */
        balanceAvaxTotal: new BN(balanceAvaxTotal, 'hex'),
        balanceX: Object.keys(state.balances.balanceX).reduce((acc, key) => {
          const { locked, unlocked } = state.balances.balanceX[key];
          return {
            ...acc,
            [key]: {
              ...state.balances.balanceX[key],
              locked: new BN(locked, 'hex'),
              unlocked: new BN(unlocked, 'hex'),
            },
          };
        }, {}),
        balanceAvax: {
          C: new BN(state.balances.balanceAvax.C, 'hex'),
          X: {
            ...state.balances.balanceAvax.X,
            locked: new BN(state.balances.balanceAvax.X.locked, 'hex'),
            unlocked: new BN(state.balances.balanceAvax.X.unlocked, 'hex'),
          },
          P: {
            ...state.balances.balanceAvax.P,
            unlocked: new BN(state.balances.balanceAvax.P.unlocked, 'hex'),
            locked: new BN(state.balances.balanceAvax.P.locked, 'hex'),
            lockedStakeable: new BN(
              state.balances.balanceAvax.P.lockedStakeable,
              'hex'
            ),
          },
        },
        balanceStaked: {
          ...state.balances.balanceStaked,
          staked: new BN(state.balances.balanceStaked.staked, 'hex'),
        },
      },
      erc20Tokens: state.erc20Tokens.map((token) => ({
        ...token,
        balance: new BN(token.balance, 'hex'),
      })),
    },
  };
}

export function WalletContextProvider({ children }: { children: any }) {
  const { request, events } = useConnectionContext();
  const [walletState, setWalletState] = useState<
    WalletState | WalletLockedState
  >();

  // listen for wallet creation
  useEffect(() => {
    if (!request || !events) {
      return;
    }

    concat(
      request<WalletState>({ method: ExtensionRequest.WALLET_STATE }),
      events().pipe(
        filter(walletUpdatedEventListener),
        map((evt) => evt.value)
      )
    ).subscribe((state: any) =>
      isWalletLocked(state)
        ? setWalletState(state)
        : state &&
          (state as WalletState).balances &&
          setWalletState(recastWalletState(state as WalletState))
    );
  }, []);

  function unlockWallet(password: string) {
    return request!({
      method: ExtensionRequest.WALLET_UNLOCK_STATE,
      params: [password],
    });
  }

  if (!walletState) {
    return <LoadingIcon />;
  }

  if (isWalletLocked(walletState)) {
    return <WalletLocked unlockWallet={unlockWallet} />;
  }

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
