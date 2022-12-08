import {
  ComponentSize,
  CustomToast,
  FileDownload,
  HorizontalFlex,
  Input,
  LoadingSpinnerIcon,
  PrimaryButton,
  toast,
  TransactionToastType,
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
  const balance = useBalanceTotalInCurrency(derivedAddresses as Account);
  const { addAccount } = useAccountsContext();
  const history = useHistory();

  const isLoading = hasFocus && !derivedAddresses;

  const handleImport = async () => {
    setImportLoading(true);
    try {
      await addAccount('', {
        importType: ImportType.PRIVATE_KEY,
        data: privateKey,
      });
      toast.custom(<CustomToast label={t('Private Key Imported')} />);
      capture('ImportPrivateKeySucceeded');
    } catch (err) {
      toast.custom(
        <CustomToast
          label={t('Private Key Import Failed')}
          type={TransactionToastType.ERROR}
        />
      );
      console.error(err);
    }
    setImportLoading(false);
    history.replace(`/accounts?activeTab=${AccountsTabs.IMPORTED}`);
  };

  useEffect(() => {
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
      } catch (err) {
        setDerivedAddresses(undefined);
      }
    } else {
      setDerivedAddresses(undefined);
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
          }}
          value={privateKey}
          placeholder={t('Enter Private Key')}
          type="password"
          width="100%"
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
        <Typography size={12} height="20px" weight={400} margin="8px 0 0">
          {t('Add an account by entering a private key')}
        </Typography>
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
