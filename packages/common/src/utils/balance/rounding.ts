export const modifyFractionNumber = (amount: number) => {
  const [integer, fraction] = parseScientificNotation(amount.toString());
  if (!fraction) {
    return amount;
  }
  const maxFractionLengt = Number(integer) === 0 ? 3 : 2; // Only show 3 decimals we're below $1 (or other currency)
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
