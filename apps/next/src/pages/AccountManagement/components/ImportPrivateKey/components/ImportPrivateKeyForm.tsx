import { LessRoundedPasswordField } from '@/components/StandaloneField';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import {
  useAnalyticsContext,
  useBalancesContext,
  useBalanceTotalInCurrency,
  useSettingsContext,
} from '@core/ui';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useImportPrivateKey } from '../hooks/useImportPrivateKey';
import { DerivedAddresses } from '../types';
import { DerivedAddressList } from './DerivedAddressList';

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
        try {
          const foundDerivedAddresses = getDerivedAddresses(newKey);
          if (foundDerivedAddresses) {
            setIsKnownAccount(foundDerivedAddresses.isKnownAddress);
            setDerivedAddresses(foundDerivedAddresses.derivedAddresses);
            setError('');
          }
        } catch (err: unknown) {
          const validationError = t(
            'The key you entered is invalid. Please try again',
          );
          errorHandler(err instanceof Error ? err.message : validationError);
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
                <Typography variant="caption">
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
