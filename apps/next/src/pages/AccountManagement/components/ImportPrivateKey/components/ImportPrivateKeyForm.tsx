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
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  toast,
  Typography,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { useNetworkContext } from '@core/ui/src/contexts/NetworkProvider';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from 'bitcoinjs-lib';
import { useImportPrivateKey } from '../hooks/useImportPrivateKey';
import { useHistory } from 'react-router-dom';
import { DerivedAddresses } from '../types';
import { DerivedAddressList } from './DerivedAddressList';
import { useBalanceTotalInCurrency } from '@core/ui/src/hooks/useBalanceTotalInCurrency';
import { Account } from '@core/types';
import { useBalancesContext, useSettingsContext } from '@core/ui';
import { EyeIcon, EyeOffIcon } from '@avalabs/core-k2-components';

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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Typography variant="h2" sx={{ mt: '23px', mb: 6 }}>
        {t('Import private key')}
      </Typography>

      <Stack sx={{ rowGap: 2 }}>
        <TextField
          onChange={keyInputHandler}
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? 'hide the password'
                        : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          label={t('Enter private key')}
        />
        {error && <Typography color="error">{error}</Typography>}
        <DerivedAddressList
          derivedAddresses={derivedAddresses}
          isLoading={isImportLoading}
        />

        {derivedAddresses && (
          <Card sx={{ p: 2 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'fontWeightSemibold' }}
              >
                {t('Total Balance')}
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
      <Button
        disabled={!readyToImport}
        onClick={handleImport}
        sx={{ marginTop: 'auto' }}
      >
        {t('Import')}
      </Button>
    </Stack>
  );
};
