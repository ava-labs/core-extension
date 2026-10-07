import {
  getLedgerAppNotInstalledMessage,
  getLedgerAutoOpenAppFailedMessage,
} from './ledgerAppMessages';

describe('utils/ledger/ledgerAppMessages', () => {
  it('names the app the user needs to open', () => {
    expect(getLedgerAutoOpenAppFailedMessage('Avalanche')).toBe(
      'Could not switch to the Avalanche app automatically. Open it on your Ledger, then try again.',
    );
  });

  it('names the app the user needs to install', () => {
    expect(getLedgerAppNotInstalledMessage('Solana')).toBe(
      'The Solana app is not installed on this Ledger device. Install it from Ledger Live, then try again.',
    );
  });
});
