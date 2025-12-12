// ledgerAppVersion >= requiredAppVersion or ledgerAppVersion <= maxAppVersion
export function isLedgerVersionCompatible(
  ledgerAppVersion: string,
  requiredAppVersion: string,
  requirement: 'minimum' | 'maximum' = 'minimum',
) {
  const compare = ledgerAppVersion.localeCompare(
    requiredAppVersion,
    undefined,
    {
      numeric: true,
      sensitivity: 'base',
    },
  );

  if (requirement === 'minimum') {
    // ledgerAppVersion > requiredAppVersion
    if (compare === 1) return true;
    // ledgerAppVersion = requiredAppVersion
    if (compare === 0) return true;
    // ledgerAppVersion < requiredAppVersion
    if (compare === -1) return false;
  }

  // ledgerAppVersion < maxAppVersion
  if (compare === -1) return true;
  // ledgerAppVersion = maxAppVersion
  if (compare === 0) return true;
  // ledgerAppVersion > maxAppVersion
  if (compare === 1) return false;
}
