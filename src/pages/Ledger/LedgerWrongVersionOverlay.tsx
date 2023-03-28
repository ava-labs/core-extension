import { LedgerWrongVersion } from './LedgerWrongVersion';
import { WalletType } from '@src/background/services/wallet/models';
import { useWalletContext } from '@src/contexts/WalletProvider';
import {
  REQUIRED_LEDGER_VERSION,
  useLedgerContext,
} from '@src/contexts/LedgerProvider';
import { isLedgerVersionCompatible } from '@src/utils/isLedgerVersionCompatible';
import { Backdrop, Stack } from '@avalabs/k2-components';

export function LedgerWrongVersionOverlay({
  onClose,
}: {
  onClose?: () => void;
}) {
  const { walletType } = useWalletContext();
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
  if (
    !ledgerVersionWarningClosed &&
    walletType === WalletType.LEDGER &&
    ledgerCheck
  ) {
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
