import { Quote, ServiceType } from '@avalabs/fusion-sdk';

type MarkrQuote = Omit<Quote, 'serviceType'> & {
  serviceType: ServiceType.MARKR;
};
export const isMarkrQuote = (quote?: Quote | null): quote is MarkrQuote =>
  quote?.serviceType === ServiceType.MARKR;
