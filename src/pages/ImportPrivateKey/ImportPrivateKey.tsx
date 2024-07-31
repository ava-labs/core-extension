import {
  Button,
  CircularProgress,
  DownloadIcon,
  Stack,
  TextField,
  Typography,
  toast,
  useTheme,
} from '@avalabs/k2-components';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/core-wallets-sdk';
import { Account } from '@src/background/services/accounts/models';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { networks } from 'bitcoinjs-lib';
import { t } from 'i18next';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AccountsTab } from '../Accounts/Accounts';
import { DerivedAddress, NetworkType } from './components/DerivedAddress';
import { utils } from '@avalabs/avalanchejs';
import { usePrivateKeyImport } from '../Accounts/hooks/usePrivateKeyImport';

type DerivedAddresses = {
  addressC: string;
  addressBTC: string;
};

export function ImportPrivateKey() {
  const { currency, currencyFormatter } = useSettingsContext();
  const { updateBalanceOnAllNetworks } = useBalancesContext();
  const { network } = useNetworkContext();
  const { capture } = useAnalyticsContext();
  const theme = useTheme();
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

  const isLoading = hasFocus && !derivedAddresses && !error;

  const handleImport = async () => {
    capture('ImportPrivateKeyClicked');
    try {
      await importPrivateKey(privateKey);
      toast.success(t('Private Key Imported'), { duration: 2000 });
      capture('ImportPrivateKeySucceeded');
      history.replace(`/accounts?activeTab=${AccountsTab.Imported}`);
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 2000 });
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
        const addressBTC = getBtcAddressFromPubKey(
          publicKey,
          network?.isTestnet ? networks.testnet : networks.bitcoin
        );

        setDerivedAddresses({
          addressC,
          addressBTC,
        });
        setError('');
      } catch (err) {
        errorHandler();
      }
    } else {
      errorHandler();
    }
  }, [network?.isTestnet, privateKey]);

  useEffect(() => {
    if (derivedAddresses && updateBalanceOnAllNetworks) {
      setIsBalanceLoading(true);
      updateBalanceOnAllNetworks([derivedAddresses as Account]).finally(() =>
        setIsBalanceLoading(false)
      );
    }
  }, [derivedAddresses, updateBalanceOnAllNetworks]);

  return (
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
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
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
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightSemibold' }}>
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
  );
}
