import {
  Button,
  CircularProgress,
  DownloadIcon,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import { Account } from '@core/types';
import { PageTitle } from '@/components/common/PageTitle';
import { useAnalyticsContext } from '@core/ui';
import { useBalancesContext } from '@core/ui';
import { useNetworkContext } from '@core/ui';
import { useSettingsContext } from '@core/ui';
import { useBalanceTotalInCurrency } from '@core/ui';
import { networks } from 'bitcoinjs-lib';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DerivedAddress, NetworkType } from './components/DerivedAddress';
import { utils } from '@avalabs/avalanchejs';
import { usePrivateKeyImport } from '@core/ui';
import { useScopedToast } from '@core/ui';
import { useAccountsContext } from '@core/ui';
import { DuplicatedAccountDialog } from './components/DuplicatedAccountDialog';
import { useTranslation } from 'react-i18next';

type DerivedAddresses = {
  addressC: string;
  addressBTC: string;
};

export function ImportPrivateKey() {
  const { t } = useTranslation();
  const { currency, currencyFormatter } = useSettingsContext();
  const { updateBalanceOnNetworks } = useBalancesContext();
  const { network } = useNetworkContext();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
  const toast = useScopedToast('account-switcher');
  const [hasFocus, setHasFocus] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddresses>();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const balance = useBalanceTotalInCurrency(derivedAddresses as Account);
  const { isImporting: isImportLoading, importPrivateKey } =
    usePrivateKeyImport();
  const history = useHistory();
  const { allAccounts, selectAccount } = useAccountsContext();
  const [isKnownAccount, setIsKnownAccount] = useState(false);
  const [isDuplicatedAccountDialogOpen, setIsDuplicatedAccountDialogOpen] =
    useState(false);

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

  const isLoading = hasFocus && !derivedAddresses && !error;

  const handleImport = async () => {
    capture('ImportPrivateKeyClicked');
    if (isKnownAccount && !isDuplicatedAccountDialogOpen) {
      setIsDuplicatedAccountDialogOpen(true);
      return;
    }
    try {
      const importedAccountId = await importPrivateKey(privateKey);
      await selectAccount(importedAccountId);
      toast.success(t('Private Key Imported'), { duration: 1000 });
      capture('ImportPrivateKeySucceeded');
      history.replace(`/accounts`);
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 1000 });
      console.error(err);
    }
  };

  useEffect(() => {
    function errorHandler() {
      setDerivedAddresses(undefined);
      setError(t('Invalid key. Please re-enter the key.'));
    }

    const strippedPk = utils.strip0x(privateKey);

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
        setError('');
      } catch (_err) {
        errorHandler();
      }
    } else {
      errorHandler();
    }
  }, [checkIfAccountExists, isKnownAccount, network?.isTestnet, privateKey, t]);

  useEffect(() => {
    if (derivedAddresses && updateBalanceOnNetworks) {
      setIsBalanceLoading(true);
      updateBalanceOnNetworks([derivedAddresses as Account]).finally(() =>
        setIsBalanceLoading(false),
      );
    }
  }, [derivedAddresses, updateBalanceOnNetworks]);

  return (
    <>
      {isKnownAccount && (
        <DuplicatedAccountDialog
          onClose={() => setIsDuplicatedAccountDialogOpen(false)}
          onConfirm={() => handleImport()}
          open={isDuplicatedAccountDialogOpen}
        />
      )}
      <Stack
        sx={{
          width: '100%',
          height: '100%',
          background: theme.palette.background.paper,
        }}
      >
        <PageTitle margin={'24px 0 8px'} onBackClick={() => history.goBack()}>
          {t('Import Private Key')}
        </PageTitle>
        <Stack sx={{ px: 2, gap: 3, height: '100%' }}>
          <Stack sx={{ gap: 1.5 }}>
            <TextField
              autoFocus
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleImport();
                }
              }}
              data-testid="import-private-key-input"
              fullWidth
              label={t('Enter Private Key')}
              inputLabelProps={{
                sx: { transform: 'none', fontSize: 'body2.fontSize' },
              }}
              onChange={(e) => {
                setIsKnownAccount(false);
                setPrivateKey(e.target.value);
                if (!isFormDirty) setIsFormDirty(true);
              }}
              value={privateKey}
              placeholder={t('Enter Private Key')}
              type="password"
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
            />
            {error && isFormDirty ? (
              <Typography variant="caption" color={theme.palette.error.main}>
                {error}
              </Typography>
            ) : (
              <Typography variant="caption">
                {t('Add an account by entering a private key')}
              </Typography>
            )}
          </Stack>

          <Stack sx={{ gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 'fontWeightSemibold' }}
            >
              {t('Derived Addresses')}
            </Typography>
            <DerivedAddress
              networkType={NetworkType.AVALANCHE}
              address={derivedAddresses?.addressC ?? ''}
              isLoading={isLoading}
            />
            <DerivedAddress
              networkType={NetworkType.BITCOIN}
              address={derivedAddresses?.addressBTC ?? ''}
              isLoading={isLoading}
            />
          </Stack>

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

          <Stack
            sx={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
              pt: 2,
              pb: 3,
            }}
          >
            <Button
              data-testid="import-private-key-button"
              size="large"
              disabled={!derivedAddresses || isImportLoading}
              fullWidth
              onClick={handleImport}
              isLoading={isImportLoading}
              sx={{ gap: 1.5 }}
            >
              <DownloadIcon size={16} />
              {t('Import Private Key')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
