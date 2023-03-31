import { getEvmAddressFromPubKey } from '@avalabs/wallets-sdk';
import { WalletType } from '@src/background/services/wallet/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { LedgerAppType, useLedgerContext } from '@src/contexts/LedgerProvider';
import { useWalletContext } from '@src/contexts/WalletProvider';
import { useEffect, useState } from 'react';
import { MigrateMissingPublicKeysFromLedgerHandler } from '@src/background/services/ledger/handlers/migrateMissingPublicKeysFromLedger';
import { ExtensionRequest } from '@src/background/connections/extensionConnection/models';
import { useConnectionContext } from '@src/contexts/ConnectionProvider';

const useIsIncorrectDevice = () => {
  const [isIncorrectDevice, setIsIncorrectDevice] = useState<boolean>(false);
  const { isWalletLocked, walletType, derivationPath } = useWalletContext();
  const { request } = useConnectionContext();
  const {
    hasLedgerTransport,
    getPublicKey,
    getMasterFingerprint,
    appType,
    masterFingerprint,
  } = useLedgerContext();
  const { accounts } = useAccountsContext();
  const firstAddress = accounts.primary[0]?.addressC;

  useEffect(() => {
    const compareAddresses = async () => {
      setIsIncorrectDevice(false);

      if (
        !isWalletLocked &&
        walletType === WalletType.LEDGER &&
        hasLedgerTransport &&
        derivationPath
      ) {
        try {
          if (firstAddress && appType === LedgerAppType.AVALANCHE) {
            const pubKey = await getPublicKey(0, derivationPath);
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
        } catch (err) {
          // some problem occured with the app
          // just wait until LedgerProvider recreates the app instance
        }
      }
    };

    compareAddresses();
  }, [
    isWalletLocked,
    walletType,
    derivationPath,
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
