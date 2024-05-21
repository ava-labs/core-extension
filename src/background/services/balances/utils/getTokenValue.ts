export function getTokenValue(decimals: number, amount?: number) {
  return amount === undefined ? 0 : amount / 10 ** decimals;
}
