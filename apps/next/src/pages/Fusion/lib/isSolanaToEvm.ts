import { Quote } from '@avalabs/fusion-sdk';

export const isSolanaToEvm = (quote: Quote) => {
  return (
    quote.sourceChain.chainId.startsWith('solana:') &&
    quote.targetChain.chainId.startsWith('eip155:')
  );
};
