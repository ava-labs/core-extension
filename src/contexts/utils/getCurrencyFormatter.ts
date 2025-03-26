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
    const minAmount = 0.001;
    const isTooSmall = amount < minAmount ? true : false;
    const prefixString = isTooSmall ? '<' : '';

    const transformedAmount = isTooSmall
      ? minAmount
      : modifyFractionNumber(amount);

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

const modifyFractionNumber = (amount: number) => {
  const maxFractionLengt = 3;

  const [integer, fraction] = parseScientificNotation(amount.toString());
  if (!fraction) {
    return amount;
  }
  const lastNonZeroFractionIndex =
    maxFractionLengt -
    (fraction
      ?.split('')
      .reverse()
      .findIndex((value) => value !== '0') || 0);

  return parseFloat(
    `${integer}.${fraction?.slice(0, lastNonZeroFractionIndex)}`,
  );
};

const parseScientificNotation = (amount: string) => {
  // When the number is extremely small or big we don't want to take care of it at the moment
  if (amount.toString().includes('e') && amount.toString().includes('-')) {
    return ['0', '001'];
  }
  if (amount.toString().includes('e') && amount.toString().includes('+')) {
    return ['Infinity', 'Infinity'];
  }
  return amount.toString().split('.');
};
