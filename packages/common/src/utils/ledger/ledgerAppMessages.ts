export function getLedgerAutoOpenAppFailedMessage(appName: string): string {
  return `Could not switch to the ${appName} app automatically. Open it on your Ledger, then try again.`;
}

export function getLedgerAppNotInstalledMessage(appName: string): string {
  return `The ${appName} app is not installed on this Ledger device. Install it from Ledger Live, then try again.`;
}
