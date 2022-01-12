import { WalletState } from '@avalabs/wallet-react-components';
import { BN } from '@avalabs/avalanche-wallet-sdk';

export function recastWalletState(state: WalletState) {
  return {
    ...state,
    ...{
      recentTxHistory: state.recentTxHistory.map((tx) => ({
        ...tx,
        timestamp: new Date(tx.timestamp),
      })),
      avaxToken: {
        ...state.avaxToken,
        balance: new BN(state.avaxToken.balance, 'hex'),
      },
      erc20Tokens: state.erc20Tokens.map((token) => ({
        ...token,
        balance: new BN(token.balance, 'hex'),
      })),
    },
  };
}
