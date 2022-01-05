import { WalletState } from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export function recastWalletState(state: WalletState) {
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
      avaxToken: {
        ...state.avaxToken,
        balance: new BN(state.avaxToken.balance, 'hex'),
      },
      erc20Tokens: state.erc20Tokens.map((token) => ({
        ...token,
        balance: new BN(token.balance, 'hex'),
      })),
      antTokens: state.antTokens.map((token) => ({
        ...token,
        balance: new BN(token.balance, 'hex'),
      })),
    },
  };
}
