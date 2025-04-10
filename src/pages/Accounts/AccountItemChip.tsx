import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyIcon,
  WalletConnectIcon,
  FireblocksIcon,
  Chip,
} from '@avalabs/core-k2-components';

import { Account, AccountType } from 'packages/service-worker/src/services/accounts/models';

interface AccountItemChipProps {
  account: Account;
  isActive?: boolean;
}

export function AccountItemChip({ account, isActive }: AccountItemChipProps) {
  const { t } = useTranslation();
  const { type: accountType } = account;

  const fontColor = isActive ? 'white' : 'inherit';

  const icon = useMemo(() => {
    switch (accountType) {
      case AccountType.IMPORTED:
        return <KeyIcon color={fontColor} />;

      case AccountType.FIREBLOCKS:
        return <FireblocksIcon color={fontColor} />;

      case AccountType.WALLET_CONNECT:
        return <WalletConnectIcon color={fontColor} />;

      default:
        return null;
    }
  }, [accountType, fontColor]);

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
      sx={{
        fontWeight: isActive ? '600' : 'normal',
        color: fontColor,
        backgroundColor: isActive ? 'grey.400' : 'rgba(255, 255, 255, 0.16)',
      }}
    />
  );
}
