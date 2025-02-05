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

  return (amount: number) => {
    const transformedAmount = modifyFractionNumber(amount);
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

    return formatter.format(transformedAmount);
  };
};

const modifyFractionNumber = (amount: number) => {
  const [integer, fraction] = amount.toString().split('.');
  const indexOfNonZero = fraction?.search(/[1-9]/);

  if (!indexOfNonZero || indexOfNonZero < 2 || integer !== '0') {
    return parseFloat(`${integer}.${fraction?.slice(0, 2)}`);
  }
  if (indexOfNonZero && indexOfNonZero >= 2 && integer === '0') {
    return parseFloat(`${integer}.${fraction?.slice(0, indexOfNonZero + 1)}`);
  }
  return amount;
};
