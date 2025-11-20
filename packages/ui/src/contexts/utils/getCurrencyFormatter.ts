import { modifyFractionNumber } from '@core/common';

export const getCurrencyFormatter = (currency = 'USD') => {
  /**
   * For performance reasons we want to instantiate this as little as possible
   */
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 6,
  });

  return (amount: number, withRounding = true) => {
    const minAmount = 0.001;
    const isTooSmall = amount < minAmount && amount > 0 ? true : false;
    const prefixString = isTooSmall ? '<' : '';

    const transformedAmount = isTooSmall
      ? minAmount
      : withRounding
        ? modifyFractionNumber(amount)
        : amount;

    const parts = formatter.formatToParts(transformedAmount);

    /**
     *  This formats the currency to return
     *  <symbol><amount>
     *  ex. $10.00, €10.00
     * if the (ie. CHF) matches the the it returns
     * <amount><symbol>
     * ex. 10 CHF
     */

    if (parts[0]?.value === currency) {
      const flatArray = parts.map((x) => x.value);
      flatArray.push(` ${flatArray.shift() || ''}`);
      return flatArray.join('').trim();
    }

    return `${prefixString}${formatter.format(transformedAmount)}`;
  };
};
