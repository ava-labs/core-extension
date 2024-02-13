import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyIcon,
  WalletConnectIcon,
  FireblocksIcon,
  Chip,
} from '@avalabs/k2-components';

import { Account, AccountType } from '@src/background/services/accounts/models';

interface AccountItemChipProps {
  account: Account;
}

export function AccountItemChip({ account }: AccountItemChipProps) {
  const { t } = useTranslation();
  const { type: accountType } = account;

  const icon = useMemo(() => {
    switch (accountType) {
      case AccountType.IMPORTED:
        return <KeyIcon />;

      case AccountType.FIREBLOCKS:
        return <FireblocksIcon />;

      case AccountType.WALLET_CONNECT:
        return <WalletConnectIcon />;

      default:
        return null;
    }
  }, [accountType]);

  const label = useMemo(() => {
    switch (accountType) {
      case AccountType.IMPORTED:
        return t('Private Key');

      case AccountType.FIREBLOCKS:
        return t('Fireblocks');

      case AccountType.WALLET_CONNECT:
        return t('Wallet Connect');

      default:
        return null;
    }
  }, [accountType, t]);

  if (!icon || !label) {
    return null;
  }

  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{ fontWeight: 'normal' }}
    />
  );
}
