import { ServiceType } from '@avalabs/fusion-sdk';

import { shouldShowSlippageAndPriceImpact } from './shouldShowSlippageAndPriceImpact';

describe('shouldShowSlippageAndPriceImpact', () => {
  it.each([
    ServiceType.AVALANCHE_CCT,
    ServiceType.WRAP_UNWRAP,
    ServiceType.LOMBARD_BTCB_TO_BTC,
    ServiceType.LOMBARD_BTC_TO_BTCB,
  ])('returns false for %s quotes', (serviceType) => {
    expect(shouldShowSlippageAndPriceImpact({ serviceType })).toBe(false);
  });

  it.each([ServiceType.MARKR, ServiceType.AVALANCHE_EVM])(
    'returns true for %s quotes',
    (serviceType) => {
      expect(shouldShowSlippageAndPriceImpact({ serviceType })).toBe(true);
    },
  );

  it('returns true when there is no active quote', () => {
    expect(shouldShowSlippageAndPriceImpact()).toBe(true);
    expect(shouldShowSlippageAndPriceImpact(null)).toBe(true);
  });
});
