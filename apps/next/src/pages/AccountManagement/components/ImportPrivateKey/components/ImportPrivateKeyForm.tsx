import { utils } from '@avalabs/avalanchejs';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui/src/contexts/AccountsProvider';
import { useNetworkContext } from '@core/ui/src/contexts/NetworkProvider';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { networks } from 'bitcoinjs-lib';
import { DerivedAddresses } from '../types';
import { DerivedAddressList } from './DerivedAddressList';
import { useBalanceTotalInCurrency } from '@core/ui/src/hooks/useBalanceTotalInCurrency';
import { Account } from '@core/types';
import {
  useAnalyticsContext,
  useBalancesContext,
  useSettingsContext,
} from '@core/ui';
import { LessRoundedPasswordField } from '../../ShowPrivateKey/components/EnterPassword';

interface ImportPrivateKeyFormProps {
  handleImport: () => void;
  isImportLoading: boolean;
  privateKey: string;
  setPrivateKey: Dispatch<SetStateAction<string>>;
  setIsDuplicatedAccountDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const ImportPrivateKeyForm = ({
  handleImport,
  isImportLoading,
  privateKey,
  setPrivateKey,
  setIsDuplicatedAccountDialogOpen,
}: ImportPrivateKeyFormProps) => {
  const { t } = useTranslation();
  const { capture } = useAnalyticsContext();

  const { allAccounts } = useAccountsContext();
  const { network } = useNetworkContext();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { currency, currencyFormatter } = useSettingsContext();

  const [isKnownAccount, setIsKnownAccount] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddresses>();
  const [error, setError] = useState('');

  const balance = useBalanceTotalInCurrency(derivedAddresses as Account);

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
    [allAccounts, setIsKnownAccount],
  );

  const errorHandler = useCallback(
    (errorMessage: string) => {
      setDerivedAddresses(undefined);
      setError(errorMessage);
    },
    [setDerivedAddresses, setError],
  );

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
    [
      checkIfAccountExists,
      errorHandler,
      network?.isTestnet,
      setDerivedAddresses,
      setError,
      t,
    ],
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
    [errorHandler, setPrivateKey, t, validate],
  );

  const readyToImport = derivedAddresses && !error && !isImportLoading;

  const handleSubmit = useCallback(() => {
    capture('ImportPrivateKeyConfirmClicked');
    if (isKnownAccount) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }

    return handleImport();
  }, [isKnownAccount, setIsDuplicatedAccountDialogOpen, handleImport, capture]);

  return (
    <>
      <Typography
        variant="h2"
        sx={{
          mt: '23px',
          mb: 6,
          '&.MuiTypography-root': {
            fontWeight: 700,
          },
        }}
      >
        {t('Import private key')}
      </Typography>
      <Stack>
        <LessRoundedPasswordField
          value={privateKey}
          placeholder={t('Enter private key')}
          onChange={keyInputHandler}
          error={!!error}
          helperText={error}
        />

        {!error && (
          <Stack sx={{ mt: 2, rowGap: '10px' }}>
            <DerivedAddressList
              derivedAddresses={derivedAddresses}
              isLoading={isImportLoading}
            />

            {derivedAddresses && (
              <Card sx={{ p: 2 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
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

      <Box marginTop="auto">
        <Button
          disabled={!readyToImport}
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          onClick={handleSubmit}
        >
          {t('Import')}
        </Button>
      </Box>
    </>
  );
};
