interface GetAccountKey {
  address: string;
  isTestnet?: boolean;
}

export function getAccountKey({ address, isTestnet }: GetAccountKey) {
  const accountSuffix = !isTestnet ? '' : '-test';
  return `${address}${accountSuffix}`;
}
