import { WalletState } from '@avalabs/wallet-react-components';
import { hexToBN } from '@src/utils/hexToBN';

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
        balance: hexToBN(state.avaxToken.balance),
      },
      erc20Tokens: state.erc20Tokens.map((token) => ({
        ...token,
        balance: hexToBN(token.balance),
      })),
    },
  };
}
