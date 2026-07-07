import { Quote, ServiceType } from '@avalabs/fusion-sdk';

const SERVICES_WITHOUT_SLIPPAGE_OR_PRICE_IMPACT = new Set<ServiceType>([
  ServiceType.AVALANCHE_CCT,
  ServiceType.WRAP_UNWRAP,
  ServiceType.LOMBARD_BTCB_TO_BTC,
  ServiceType.LOMBARD_BTC_TO_BTCB,
]);

export const shouldShowSlippageAndPriceImpact = (
  quote?: Pick<Quote, 'serviceType'> | null,
) =>
  quote
    ? !SERVICES_WITHOUT_SLIPPAGE_OR_PRICE_IMPACT.has(quote.serviceType)
    : true;
