import React, { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  ListIcon,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
  toast,
  useTheme,
} from '@avalabs/core-k2-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getAddressFromXPub,
  getXpubFromMnemonic,
} from '@avalabs/core-wallets-sdk';

import { Account } from '@core/types';
import { PageTitle } from '@/components/common/PageTitle';
import { Monitoring, truncateAddress } from '@core/common';
import { useBalancesContext } from '@core/ui';

import { useConvertedCurrencyFormatter } from '@core/ui';

import { NameYourWallet } from './components/NameYourWallet';
import { useImportSeedphrase } from '@core/ui';
import { useKeyboardShortcuts } from '@core/ui';
import { isPhraseCorrect } from '@core/common';
import { useAccountsContext } from '@core/ui';
import { useAnalyticsContext } from '@core/ui';
import { useErrorMessage } from '@core/ui';
import { Overlay } from '@/components/common/Overlay';

const EMPTY_ADDRESSES = Array(3).fill('');

enum Step {
  Import,
  Name,
}

const NoScrollTextField = styled(TextField)`
  textarea::-webkit-scrollbar {
    display: none;
  }
`;

export function AddWalletWithSeedPhrase() {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();
  const { allAccounts } = useAccountsContext();
  const { capture } = useAnalyticsContext();
  const getErrorMessage = useErrorMessage();
  const formatCurrency = useConvertedCurrencyFormatter();
  const { updateBalanceOnNetworks, getTotalBalance } = useBalancesContext();

  const { isImporting, importSeedphrase } = useImportSeedphrase();

  const [phrase, setPhrase] = useState('');
  const [step, setStep] = useState(Step.Import);
  const [addresses, setAddresses] = useState<string[]>(EMPTY_ADDRESSES);

  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isKnownPhrase, setIsKnownPhrase] = useState(false);
  console.log('isKnownPhrase: ', isKnownPhrase);
  const [isPhraseValid, setIsPhraseValid] = useState(false);

  const deriveAddresses = useCallback(
    async (seedPhrase: string) => {
      const xpub = await getXpubFromMnemonic(
        seedPhrase.trim().split(/\s+/g).join(' ').toLowerCase(),
      );
      setIsPhraseValid(true);

      const addies = [
        getAddressFromXPub(xpub, 0),
        getAddressFromXPub(xpub, 1),
        getAddressFromXPub(xpub, 2),
      ];

      const isMnemonicKnown = allAccounts.some(
        ({ addressC }) => addressC.toLowerCase() === addies[0]?.toLowerCase(),
      );

      if (isMnemonicKnown) {
        setIsKnownPhrase(true);
        return;
      }

      setIsKnownPhrase(false);
      setIsBalanceLoading(true);
      await updateBalanceOnNetworks(
        addies.map((addressC) => ({ addressC })) as Account[],
      );
      setIsBalanceLoading(false);
      setAddresses(addies);
    },
    [allAccounts, updateBalanceOnNetworks],
  );

  const onContinue = useCallback(() => {
    if (isPhraseValid && !isKnownPhrase) {
      setStep(Step.Name);
    }
  }, [isPhraseValid, isKnownPhrase]);

  const onPhraseChanged: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      async (event) => {
        const seedPhrase = event.target.value;

        setPhrase(seedPhrase);

        if (!seedPhrase || !isPhraseCorrect(seedPhrase)) {
          setIsPhraseValid(false);
          setAddresses(EMPTY_ADDRESSES);
          setIsKnownPhrase(false);
          return;
        }

        await deriveAddresses(seedPhrase);
      },
      [deriveAddresses],
    );

  const handleImport = useCallback(
    async (name?: string) => {
      try {
        capture('SeedphraseImportStarted');

        const result = await importSeedphrase({
          mnemonic: phrase.trim().split(/\s+/g).join(' '),
          name,
        });

        capture('SeedphraseImportSuccess');

        toast.success(t('{{walletName}} Added', { walletName: result.name }));
        history.replace('/accounts');
      } catch (err) {
        capture('SeedphraseImportFailure');
        Monitoring.sentryCaptureException(
          err as Error,
          Monitoring.SentryExceptionTypes.WALLET_IMPORT,
        );
        const { title } = getErrorMessage(err);
        toast.error(title);
      }
    },
    [capture, getErrorMessage, history, importSeedphrase, phrase, t],
  );

  const keyboardShortcuts = useKeyboardShortcuts({
    Enter: onContinue,
  });

  return (
    <>
      {step === Step.Name && (
        <Overlay>
          <NameYourWallet
            isImporting={isImporting}
            onSave={handleImport}
            onBackClick={() => setStep(Step.Import)}
          />
        </Overlay>
      )}
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.background.paper,
        }}
      >
        <Stack direction="row" sx={{ mt: 2.5, mb: 0.5, pr: 1 }}>
          <PageTitle onBackClick={() => history.replace('/accounts')}>
            {t('Add Wallet with Recovery Phrase')}
          </PageTitle>
        </Stack>

        <Stack sx={{ px: 2, pt: 1, flexGrow: 1, gap: 3 }}>
          <NoScrollTextField
            autoFocus
            data-testid="add-seed-phrase-input"
            fullWidth
            label={t('Enter Recovery Phrase')}
            inputLabelProps={{
              sx: { transform: 'none', fontSize: 'body2.fontSize', mb: 1 },
            }}
            onChange={onPhraseChanged}
            InputProps={{
              autoComplete: 'off',
              sx: {
                p: 1,
              },
            }}
            helperText={
              isKnownPhrase
                ? t(
                    'This recovery phrase appears to have already been imported.',
                  )
                : t('Add account(s) by entering a valid recovery phrase.')
            }
            multiline
            rows={3}
            value={phrase}
            placeholder={t('Enter Recovery Phrase')}
            error={isKnownPhrase}
            type="password"
            {...keyboardShortcuts}
          />

          <Stack sx={{ gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'semibold' }}>
              {t('Derived Addresses')}
            </Typography>
            <Stack sx={{ gap: 1 }}>
              {addresses.map((address, index) => {
                const balance = address ? getTotalBalance(address) : null;

                return (
                  <Card key={index} sx={{ backgroundColor: 'grey.800' }}>
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1.5,

                        ':last-child': {
                          pb: 1.5,
                        },
                      }}
                    >
                      <Tooltip placement="top" title={address}>
                        <Typography variant="body1" component="span">
                          {address ? truncateAddress(address) : '-'}
                        </Typography>
                      </Tooltip>
                      {isBalanceLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          {typeof balance === 'number'
                            ? formatCurrency(balance)
                            : ''}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          sx={{ py: 3, px: 2, justifyContent: 'center', alignItems: 'center' }}
        >
          <Tooltip
            sx={{
              width: '100%',
              cursor: 'not-allowed',
            }}
            title={
              isPhraseValid
                ? isKnownPhrase
                  ? t(
                      'This recovery phrase appears to have already been imported.',
                    )
                  : ''
                : t('Provided recovery phrase is not valid.')
            }
          >
            <Button
              fullWidth
              disabled={!isPhraseValid || isKnownPhrase}
              size="large"
              data-testid="add-wallet-with-seed-phrase"
              onClick={onContinue}
              startIcon={<ListIcon size={16} />}
            >
              {t('Add Recovery Phrase')}
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );
}
