import type { Quote, QuoteFee } from '@avalabs/fusion-sdk';

const EMPTY_ARRAY = [];

export const getAdditiveFees = (quote: Quote | null): QuoteFee[] => {
  if (!quote) {
    return EMPTY_ARRAY;
  }

  const additiveFees = quote.fees.filter(
    (fee) => fee.fundingModel === 'additive',
  );

  return additiveFees.length === 0 ? EMPTY_ARRAY : additiveFees;
};
