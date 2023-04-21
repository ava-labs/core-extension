import {
  ComponentSize,
  FileDownload,
  HorizontalFlex,
  Input,
  LoadingSpinnerIcon,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import {
  getBtcAddressFromPubKey,
  getEvmAddressFromPubKey,
  getPublicKeyFromPrivateKey,
} from '@avalabs/wallets-sdk';
import { Account, ImportType } from '@src/background/services/accounts/models';
import { PageTitle } from '@src/components/common/PageTitle';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useBalancesContext } from '@src/contexts/BalancesProvider';
import { useNetworkContext } from '@src/contexts/NetworkProvider';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { useBalanceTotalInCurrency } from '@src/hooks/useBalanceTotalInCurrency';
import { networks } from 'bitcoinjs-lib';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { AccountsTabs } from '../Accounts/Accounts';
import { DerivedAddress, NetworkType } from './components/DerivedAddress';
import { toast } from '@avalabs/k2-components';

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
  const [isImportLoading, setImportLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [derivedAddresses, setDerivedAddresses] = useState<DerivedAddresses>();
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const balance = useBalanceTotalInCurrency(derivedAddresses as Account);
  const { addAccount } = useAccountsContext();
  const history = useHistory();

  const isLoading = hasFocus && !derivedAddresses && !error;

  const handleImport = async () => {
    setImportLoading(true);
    try {
      await addAccount('', {
        importType: ImportType.PRIVATE_KEY,
        data: privateKey,
      });
      toast.success(t('Private Key Imported'), { duration: 2000 });
      capture('ImportPrivateKeySucceeded');
    } catch (err) {
      toast.error(t('Private Key Import Failed'), { duration: 2000 });
      console.error(err);
    }
    setImportLoading(false);
    history.replace(`/accounts?activeTab=${AccountsTabs.IMPORTED}`);
  };

  useEffect(() => {
    function errorHandler() {
      setDerivedAddresses(undefined);
      setError(t('Invalid key. Please re-enter the key.'));
    }

    if (privateKey.length === 64) {
      try {
        const publicKey = getPublicKeyFromPrivateKey(privateKey);
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
      updateBalanceOnAllNetworks(derivedAddresses as Account).finally(() =>
        setIsBalanceLoading(false)
      );
    }
  }, [derivedAddresses, updateBalanceOnAllNetworks]);

  return (
    <VerticalFlex width="100%">
      <PageTitle
        margin={'24px 0'}
        onBackClick={() =>
          history.replace(`/accounts?activeTab=${AccountsTabs.IMPORTED}`)
        }
      >
        {t('Import Private Key')}
      </PageTitle>
      <VerticalFlex padding="16px 16px 0">
        <Typography size={14} height="20px" weight={600} margin="0 0 8px">
          {t('Enter Private Key')}
        </Typography>
        <Input
          data-testid="import-private-key-input"
          onChange={(e) => {
            setPrivateKey(e.target.value);
            if (!isFormDirty) setIsFormDirty(true);
          }}
          value={privateKey}
          placeholder={t('Enter Private Key')}
          type="password"
          width="100%"
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
        {error && isFormDirty ? (
          <Typography
            size={12}
            height="20px"
            weight={400}
            margin="8px 0 0"
            color={theme.colors.error}
          >
            {error}
          </Typography>
        ) : (
          <Typography size={12} height="20px" weight={400} margin="8px 0 0">
            {t('Add an account by entering a private key')}
          </Typography>
        )}
      </VerticalFlex>

      <VerticalFlex padding="0 16px" margin="40px 0 0">
        <Typography size={14} height="20px" weight={600}>
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
      </VerticalFlex>

      <HorizontalFlex
        padding="0 16px"
        margin="24px 0 0"
        justify="space-between"
      >
        <Typography size={14} height="20px" weight={600}>
          {t('Total Balance')}
        </Typography>
        <Typography size={14} height="20px" weight={400}>
          {isBalanceLoading ? (
            <LoadingSpinnerIcon color={theme.colors.icon1} height="16px" />
          ) : balance !== null ? (
            currencyFormatter(balance).replace(currency, '')
          ) : (
            '-'
          )}
        </Typography>
      </HorizontalFlex>

      <VerticalFlex
        align="center"
        grow="1"
        justify="flex-end"
        padding="16px 16px 24px"
      >
        <HorizontalFlex justify="center" width="100%">
          <PrimaryButton
            data-testid="import-private-key-button"
            size={ComponentSize.LARGE}
            disabled={!derivedAddresses || isImportLoading}
            width="100%"
            onClick={() => {
              capture('ImportPrivateKeyClicked');
              handleImport();
            }}
            style={{ fontSize: '14px', lineHeight: '20px' }}
          >
            {isImportLoading ? (
              <LoadingSpinnerIcon color={theme.colors.text1} height="24px" />
            ) : (
              <>
                <FileDownload
                  color={!privateKey ? theme.buttons.primary.colorDisabled : ''}
                  height="16px"
                  style={{ marginRight: '12px' }}
                />
                {t('Import Private Key')}
              </>
            )}
          </PrimaryButton>
        </HorizontalFlex>
      </VerticalFlex>
    </VerticalFlex>
  );
}
