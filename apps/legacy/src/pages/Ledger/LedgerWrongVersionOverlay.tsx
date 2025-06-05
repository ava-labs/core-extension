import { LedgerWrongVersion } from './LedgerWrongVersion';
import { useWalletContext } from '@core/ui';
import { REQUIRED_LEDGER_VERSION, useLedgerContext } from '@core/ui';
import { isLedgerVersionCompatible } from '@core/common';
import { Backdrop, Stack } from '@avalabs/core-k2-components';

export function LedgerWrongVersionOverlay({
  onClose,
}: {
  onClose?: () => void;
}) {
  const { isLedgerWallet } = useWalletContext();
  const {
    ledgerVersionWarningClosed,
    updateLedgerVersionWarningClosed,
    avaxAppVersion,
    hasLedgerTransport,
  } = useLedgerContext();

  // checks to make sure there is a AVAX ledger app version
  // ledger is connected
  // AVAX ledger app meets mininum version requirement
  const ledgerCheck =
    avaxAppVersion &&
    hasLedgerTransport &&
    !isLedgerVersionCompatible(avaxAppVersion, REQUIRED_LEDGER_VERSION);

  // Used in Onboarding
  if (onClose && ledgerCheck) {
    return (
      <Backdrop open>
        <LedgerWrongVersion onClose={onClose} />
      </Backdrop>
    );
  }

  // Used on Portfolio
  if (!ledgerVersionWarningClosed && isLedgerWallet && ledgerCheck) {
    return (
      <Backdrop open>
        <Stack sx={{ m: 2 }}>
          <LedgerWrongVersion
            onClose={() => updateLedgerVersionWarningClosed()}
          />
        </Stack>
      </Backdrop>
    );
  }

  return null;
}
