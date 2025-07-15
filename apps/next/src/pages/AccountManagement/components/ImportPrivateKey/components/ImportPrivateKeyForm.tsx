import { utils } from '@avalabs/avalanchejs';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import {
  Button,
  Card,
  CircularProgress,
  Stack,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { useNetworkContext } from '@core/ui/src/contexts/NetworkProvider';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from 'bitcoinjs-lib';
import { useImportPrivateKey } from '../hooks/useImportPrivateKey';
import { useHistory } from 'react-router-dom';
import { DerivedAddresses } from '../types';
import { DerivedAddressList } from './DerivedAddressList';
import { useBalanceTotalInCurrency } from '@core/ui/src/hooks/useBalanceTotalInCurrency';
import { Account } from '@core/types';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { DuplicatedAccountConfirmation } from './DuplicatedAccountConfirmation';
import { PasswordField } from '@/components/StandaloneField';

export const ImportPrivateKeyForm = () => {
  const { t } = useTranslation();
  const { replace } = useHistory();

  const { allAccounts, selectAccount } = useAccountsContext();
  const { network } = useNetworkContext();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { currency, currencyFormatter } = useSettingsContext();

  const [isKnownAccount, setIsKnownAccount] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddresses>();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  const balance = useBalanceTotalInCurrency(derivedAddresses as Account);

  const [error, setError] = useState('');
  const [isDuplicatedAccountDialogOpen, setIsDuplicatedAccountDialogOpen] =
    useState(false);

  const { isImporting: isImportLoading, importPrivateKey } =
    useImportPrivateKey();

  useEffect(() => {
    if (derivedAddresses && updateBalanceOnNetworks) {
      setIsBalanceLoading(true);
      updateBalanceOnNetworks([derivedAddresses as Account]).finally(() =>
        setIsBalanceLoading(false),
      );
    }
  }, [derivedAddresses, updateBalanceOnNetworks]);

  const checkIfAccountExists = useCallback(
    (address: string) => {
      const lowercasedAddress = address.toLowerCase();
      const findAccount = allAccounts.find(
        ({ addressC }) => addressC.toLowerCase() === lowercasedAddress,
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
      const validationError = t(
        'The key you entered is invalid. Please try again',
      );
      const strippedPk = utils.strip0x(key);

      if (strippedPk.length !== 64) {
        errorHandler(validationError);
        return;
      }

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
        setError('');
      } catch (_err) {
        errorHandler(validationError);
      }
    },
    [checkIfAccountExists, errorHandler, network?.isTestnet, t],
  );

  const keyInputHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newKey = event.target.value;
      setPrivateKey(newKey);

      if (newKey) {
        validate(newKey);
      } else {
        errorHandler(t('Please enter the private key.'));
      }
    },
    [errorHandler, t, validate],
  );

  const readyToImport = derivedAddresses && !error && !isImportLoading;

  const handleImport = useCallback(async () => {
    if (isKnownAccount && !isDuplicatedAccountDialogOpen) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }
    try {
      const importedAccountId = await importPrivateKey(privateKey);
      await selectAccount(importedAccountId);
      toast.success(t('Private Key Imported'), { duration: 1000 });
      replace(`/account-management`);
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 1000 });
      console.error(err);
    }
  }, [
    isKnownAccount,
    isDuplicatedAccountDialogOpen,
    importPrivateKey,
    privateKey,
    selectAccount,
    t,
    replace,
  ]);

  const handleNext = useCallback(() => {
    if (isKnownAccount && !isDuplicatedAccountDialogOpen) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }

    return handleImport();
  }, [isKnownAccount, isDuplicatedAccountDialogOpen, handleImport]);

  return (
    <Stack sx={{ height: '100%' }}>
      {isDuplicatedAccountDialogOpen ? (
        <DuplicatedAccountConfirmation
          onImportDuplicate={handleImport}
          onCancel={() => setIsDuplicatedAccountDialogOpen(false)}
        />
      ) : (
        <>
          <Typography variant="h2" sx={{ mt: '23px', mb: 6 }}>
            {t('Import private key')}
          </Typography>
          <Stack>
            <PasswordField
              value={privateKey}
              placeholder={t('Enter private key')}
              onChange={keyInputHandler}
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiFilledInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            {!error && (
              <Stack sx={{ mt: 2, rowGap: '10px' }}>
                <DerivedAddressList
                  derivedAddresses={derivedAddresses}
                  isLoading={isImportLoading}
                />

                {derivedAddresses && (
                  <Card sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {t('Total balance')}
                      </Typography>
                      <Typography variant="body2">
                        {isBalanceLoading ? (
                          <CircularProgress size={16} />
                        ) : balance !== null && balance?.sum ? (
                          currencyFormatter(balance?.sum).replace(currency, '')
                        ) : (
                          '-'
                        )}
                      </Typography>
                    </Stack>
                  </Card>
                )}
              </Stack>
            )}
          </Stack>
          <Button
            disabled={!readyToImport}
            onClick={handleNext}
            color="primary"
            sx={{
              marginTop: 'auto',
            }}
          >
            {t('Import')}
          </Button>
        </>
      )}
    </Stack>
  );
};
