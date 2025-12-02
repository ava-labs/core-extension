const BALANCE_DECIMALS = 5;

const parseResult = (result: string | number): number => {
  return Number(parseFloat(String(result)).toFixed(BALANCE_DECIMALS));
};

export const balanceToDecimal = (
  balance: string | number,
  decimals: string | number,
): number => {
  const balanceString = String(balance);
  const decimalsNumber = Number(decimals);
  const balanceLength = balanceString.length;

  if (balanceLength <= decimalsNumber) {
    const paddedBalanceString = balanceString.padStart(decimalsNumber, '0');

    return parseResult(`0.${paddedBalanceString.slice(0, decimalsNumber)}`);
  } else {
    const integerPart = balanceString.slice(0, balanceLength - decimalsNumber);
    const fractionalPart = balanceString.slice(balanceLength - decimalsNumber);

    return parseResult(`${integerPart}.${fractionalPart}`);
  }
};
