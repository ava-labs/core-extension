import type { Quote } from '@avalabs/fusion-sdk';

// Prevents unnecessary re-renders upon reference change.
const EMPTY_ARRAY = [];

export const getAdditiveFees = (quote: Quote | null) => {
  return quote
    ? quote.fees.filter((fee) => fee.fundingModel === 'additive')
    : EMPTY_ARRAY;
};
