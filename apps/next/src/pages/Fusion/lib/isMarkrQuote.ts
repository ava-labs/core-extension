import { Quote, ServiceType } from '@avalabs/unified-asset-transfer';

type MarkrQuote = Omit<Quote, 'serviceType'> & {
  serviceType: ServiceType.MARKR;
};
export const isMarkrQuote = (quote?: Quote | null): quote is MarkrQuote =>
  quote?.serviceType === ServiceType.MARKR;
