import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { DerivedAddresses } from '../types';
import { DerivedAddressList } from './DerivedAddressList';
import { Account } from '@core/types';
import {
  useAnalyticsContext,
  useBalancesContext,
  useSettingsContext,
  useBalanceTotalInCurrency,
} from '@core/ui';
import { useImportPrivateKey } from '../hooks/useImportPrivateKey';
import { LessRoundedPasswordField } from '@/components/StandaloneField/PasswordField/LessRoundedPasswordField';

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

  const { updateBalanceOnNetworks } = useBalancesContext();
  const { currency, currencyFormatter } = useSettingsContext();

  const { getDerivedAddresses } = useImportPrivateKey();

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

  const errorHandler = useCallback(
    (errorMessage: string) => {
      setDerivedAddresses(undefined);
      setError(errorMessage);
    },
    [setDerivedAddresses, setError],
  );

  const keyInputHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newKey = event.target.value;
      setPrivateKey(newKey);

      if (newKey) {
        const foundDerivedAddresses = getDerivedAddresses(newKey, errorHandler);
        if (foundDerivedAddresses) {
          setIsKnownAccount(foundDerivedAddresses.isKnownAddress);
          setDerivedAddresses(foundDerivedAddresses.derivedAddresses);
          setError('');
        }
      } else {
        errorHandler(t('Please enter the private key.'));
      }
    },
    [errorHandler, setPrivateKey, t, getDerivedAddresses],
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

        {!error && derivedAddresses && (
          <Stack sx={{ mt: 2, rowGap: '10px' }}>
            <DerivedAddressList
              derivedAddresses={derivedAddresses}
              isLoading={isImportLoading}
            />

            <Card sx={{ p: 2 }}>
              <Stack
                sx={{ flexDirection: 'row', justifyContent: 'space-between' }}
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
