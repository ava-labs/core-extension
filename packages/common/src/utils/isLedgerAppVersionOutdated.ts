const LEDGER_APP_VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

const parseLedgerAppVersion = (version: string) => {
  const match = version.trim().match(LEDGER_APP_VERSION_REGEX);
  return match ? match.slice(1).map(Number) : null;
};

/**
 * Returns `true` only when both versions are strict `MAJOR.MINOR.PATCH`
 * strings and `installedVersion` is lower than `recommendedVersion`.
 */
export function isLedgerAppVersionOutdated(
  installedVersion?: string | null,
  recommendedVersion?: string | null,
): boolean {
  if (!installedVersion || !recommendedVersion) {
    return false;
  }

  const installed = parseLedgerAppVersion(installedVersion);
  const recommended = parseLedgerAppVersion(recommendedVersion);

  if (!installed || !recommended) {
    return false;
  }

  for (const [index, part] of installed.entries()) {
    const recommendedPart = recommended[index] ?? 0;
    if (part !== recommendedPart) {
      return part < recommendedPart;
    }
  }

  return false;
}
