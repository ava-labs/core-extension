import { utils } from '@avalabs/avalanchejs';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import {
  Button,
  Stack,
  TextField,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { useNetworkContext } from '@core/ui/src/contexts/NetworkProvider';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from 'bitcoinjs-lib';
import { useImportPrivateKey } from '../hooks/useImportPrivateKey';
import { useHistory } from 'react-router-dom';

type DerivedAddresses = {
  addressC: string;
  addressBTC: string;
};
export const ImportPrivateKeyForm = () => {
  const { t } = useTranslation();
  const { allAccounts, selectAccount } = useAccountsContext();
  const [isKnownAccount, setIsKnownAccount] = useState(false);
  const { network } = useNetworkContext();
  const { replace } = useHistory();

  const [privateKey, setPrivateKey] = useState('');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddresses>();

  const [error, setError] = useState('');
  const [isDuplicatedAccountDialogOpen, setIsDuplicatedAccountDialogOpen] =
    useState(false);

  const { isImporting: isImportLoading, importPrivateKey } =
    useImportPrivateKey();

  const checkIfAccountExists = useCallback(
    (address) => {
      const findAccount = allAccounts.find(
        ({ addressC }) => addressC.toLowerCase() === address.toLowerCase(),
      );
      if (findAccount) {
        setIsKnownAccount(true);
      }
    },
    [allAccounts],
  );

  const errorHandler = useCallback((errorMessage: string) => {
    setDerivedAddresses(undefined);
    setError(errorMessage);
  }, []);

  const validate = useCallback(
    (key: string) => {
      const validationError = t('Invalid key. Please re-enter the key.');
      const strippedPk = utils.strip0x(key);

      if (strippedPk.length === 64) {
        try {
          const publicKey = getPublicKeyFromPrivateKey(strippedPk);

          const addressC = getEvmAddressFromPubKey(publicKey);
          checkIfAccountExists(addressC);

          const addressBTC = getBtcAddressFromPubKey(
            publicKey,
            network?.isTestnet ? networks.testnet : networks.bitcoin,
          );

          setDerivedAddresses({
            addressC,
            addressBTC,
          });
          setPrivateKey(key);
          setError('');
        } catch (_err) {
          errorHandler(validationError);
        }
      } else {
        errorHandler(validationError);
      }
    },
    [checkIfAccountExists, errorHandler, network?.isTestnet, t],
  );

  const keyInputHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newKey = event.target.value;
      if (newKey) {
        validate(newKey);
      } else {
        errorHandler(t('Please enter the private key.'));
      }
    },
    [errorHandler, t, validate],
  );

  const readyToImport = useMemo(() => {
    console.log({
      derivedAddresses,
      error,
      isKnownAccount,
    });
    return derivedAddresses && !error && !isImportLoading;
  }, [derivedAddresses, error, isImportLoading, isKnownAccount]);

  const handleImport = async () => {
    // capture('ImportPrivateKeyClicked');
    if (isKnownAccount && !isDuplicatedAccountDialogOpen) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }
    try {
      const importedAccountId = await importPrivateKey(privateKey);
      await selectAccount(importedAccountId);
      toast.success(t('Private Key Imported'), { duration: 1000 });
      // capture('ImportPrivateKeySucceeded');
      replace(`/account-management`); //TODO: change the path
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 1000 });
      console.error(err);
    }
  };

  return (
    <Stack>
      <Typography variant="h2">{t('Import private key')}</Typography>

      <TextField onChange={keyInputHandler} />
      {error && <Typography color="error">{error}</Typography>}
      <Button disabled={!readyToImport} onClick={handleImport}>
        {t('Import')}
      </Button>
    </Stack>
  );
};
