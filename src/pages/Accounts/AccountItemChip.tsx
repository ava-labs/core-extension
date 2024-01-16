import {
  KeyIcon,
  WalletConnectIcon,
  FireblocksIcon,
  Stack,
  Button,
  KeystoneIcon,
  LedgerIcon,
} from '@avalabs/k2-components';
import { Account, AccountType } from '@src/background/services/accounts/models';
import { WalletType } from '@src/background/services/wallet/models';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

interface AccountItemChipProps {
  account: Account;
  walletType?: WalletType;
}

export function AccountItemChip({ account, walletType }: AccountItemChipProps) {
  const { t } = useTranslation();
  const history = useHistory();
  const { type: accountType } = account;
  const { capture } = useAnalyticsContext();

  const privateKeyIsAvailable = useMemo(
    () =>
      accountType === AccountType.IMPORTED ||
      (accountType === AccountType.PRIMARY &&
        walletType === WalletType.MNEMONIC),
    [accountType, walletType]
  );

  const buttonLogo = useMemo(() => {
    if (privateKeyIsAvailable) {
      return <KeyIcon size={16} color={'currentColor'} sx={{ m: 0 }} />;
    }
    if (accountType === AccountType.WALLET_CONNECT) {
      return (
        <WalletConnectIcon size={16} color={'currentColor'} sx={{ m: 0 }} />
      );
    }
    if (accountType === AccountType.FIREBLOCKS) {
      return <FireblocksIcon size={16} color={'currentColor'} sx={{ m: 0 }} />;
    }
    if (walletType === WalletType.KEYSTONE) {
      return <KeystoneIcon size={16} color={'currentColor'} sx={{ m: 0 }} />;
    }
    if (walletType === WalletType.LEDGER) {
      return <LedgerIcon size={16} color={'currentColor'} sx={{ m: 0 }} />;
    }
    return undefined;
  }, [accountType, privateKeyIsAvailable, walletType]);

  if (!buttonLogo) {
    return null;
  }
  return (
    <Stack sx={{ alignSelf: 'end' }}>
      <Button
        data-testid="export-private-key-icon"
        color="secondary"
        size="small"
        disabled={!privateKeyIsAvailable}
        onClick={(e: Event) => {
          capture('ExportPrivateKeyClicked');
          e.stopPropagation();
          history.push(`/export-private-key?accountId=${account.id}`);
        }}
        sx={{
          p: 0,
          height: '24px',
          minWidth: '24px',
          '& span': {
            display: 'none',
          },
          '&:hover': {
            p: 1,
            '&>span': {
              display: 'initial',
              pr: 1,
            },
          },
          '&:disabled': {
            p: 0,
            color: 'currentcolor',
            '&>span': {
              display: 'none',
            },
          },
        }}
      >
        <span>{t('Show Private Key')}</span>
        {buttonLogo}
      </Button>
    </Stack>
  );
}
