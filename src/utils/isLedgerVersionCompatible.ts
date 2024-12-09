// ledgerAppVersion >= requiredAppVersion
export function isLedgerVersionCompatible(
  ledgerAppVersion: string,
  requiredAppVersion: string,
) {
  const compare = ledgerAppVersion.localeCompare(
    requiredAppVersion,
    undefined,
    {
      numeric: true,
      sensitivity: 'base',
    },
  );

  // ledgerAppVersion > requiredAppVersion
  if (compare === 1) return true;
  // ledgerAppVersion = requiredAppVersion
  if (compare === 0) return true;
  // ledgerAppVersion < requiredAppVersion
  if (compare === -1) return false;
}
