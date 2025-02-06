import { getEvmAddressFromPubKey } from '@avalabs/core-wallets-sdk';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useState } from 'react';
import { MigrateMissingPublicKeysFromLedgerHandler } from '@src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

const useIsIncorrectDevice = () => {
  const [isIncorrectDevice, setIsIncorrectDevice] = useState<boolean>(false);
  const { isWalletLocked, walletDetails, isLedgerWallet } = useWalletContext();
  const { request } = useConnectionContext();
  const {
    hasLedgerTransport,
    getPublicKey,
    getMasterFingerprint,
    appType,
    masterFingerprint,
  } = useLedgerContext();
  const { accounts } = useAccountsContext();
  const activeWalletAccount = accounts.active?.id;

  const firstAccount =
    activeWalletAccount && accounts.primary[activeWalletAccount];

  const firstAddress =
    firstAccount && firstAccount[0] && firstAccount[0].addressC;

  useEffect(() => {
    const compareAddresses = async () => {
      setIsIncorrectDevice(false);

      if (
        !isWalletLocked &&
        walletDetails &&
        isLedgerWallet &&
        hasLedgerTransport
      ) {
        try {
          if (firstAddress && appType === LedgerAppType.AVALANCHE) {
            const pubKey = await getPublicKey(0, walletDetails.derivationPath);
            const address = getEvmAddressFromPubKey(pubKey);
            const isMatching = firstAddress === address;

            setIsIncorrectDevice(!isMatching);

            if (isMatching) {
              // Attempt to migrate missing X/P public keys (if there's any) once the device is verified
              await request<MigrateMissingPublicKeysFromLedgerHandler>({
                method: ExtensionRequest.LEDGER_MIGRATE_MISSING_PUBKEYS,
              });
            }
          } else if (masterFingerprint && appType === LedgerAppType.BITCOIN) {
            const masterFingerPrintFromDevice = await getMasterFingerprint();
            const isMatching =
              masterFingerPrintFromDevice === masterFingerprint;

            setIsIncorrectDevice(!isMatching);
          }
        } catch (_err) {
          // some problem occured with the app
          // just wait until LedgerProvider recreates the app instance
        }
      }
    };

    compareAddresses();
  }, [
    isWalletLocked,
    isLedgerWallet,
    walletDetails,
    firstAddress,
    getPublicKey,
    hasLedgerTransport,
    appType,
    request,
    getMasterFingerprint,
    masterFingerprint,
  ]);

  return isIncorrectDevice;
};

export default useIsIncorrectDevice;
