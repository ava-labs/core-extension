import { FC } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { Fade, Stack, truncateAddress, Typography } from '@avalabs/k2-alpine';

import { useAccountsContext, useWalletContext } from '@core/ui';
import { AddressType, SecretType } from '@core/types';
import { isPrimaryAccount } from '@core/common';

import { WalletIcon } from '@/components/WalletIcon/WalletIcon';
import { HexagonalIcon } from '@/components/HexagonalIcon';
import { getAddressByType } from '@/utils/getAddressByType';

import { AccountRecipient } from '../../types';
import { StyledMenuItem } from './StyledMenuItem';

type AccountRecipientItemProps = {
  recipient: AccountRecipient;
  addressType: AddressType;
  isSelected: boolean;
};

const IMPORTED_ACCOUNTS = {
  type: SecretType.PrivateKey,
  authProvider: undefined,
} as const;

export const AccountRecipientItem: FC<AccountRecipientItemProps> = ({
  recipient,
  addressType,
  isSelected,
  ...rest
}) => {
  const { t } = useTranslation();
  const { getWallet } = useWalletContext();
  const {
    accounts: { active: activeAccount },
  } = useAccountsContext();
  const activeWalletId = isPrimaryAccount(activeAccount)
    ? activeAccount.walletId
    : null;

  const wallet = isPrimaryAccount(recipient.account)
    ? getWallet(recipient.account.walletId)
    : IMPORTED_ACCOUNTS;

  const description =
    wallet?.type === SecretType.PrivateKey
      ? t('from imported accounts')
      : wallet?.name
        ? t('from {{walletName}}', {
            walletName: wallet?.name ?? t('unknown wallet'),
          })
        : truncateAddress(
            getAddressByType(recipient.account, addressType) ?? '',
            20,
          );

  const isActiveWallet =
    activeWalletId && isPrimaryAccount(recipient.account)
      ? activeWalletId === recipient.account.walletId
      : false;

  return (
    <StyledMenuItem value={recipient.id} {...rest}>
      <Stack
        width="100%"
        direction="row"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <HexagonalIcon size={32}>
          <WalletIcon
            type={wallet?.type ?? SecretType.PrivateKey}
            authProvider={wallet?.authProvider}
            expanded={isActiveWallet}
            size={20}
          />
        </HexagonalIcon>
        <Stack gap={0.25} flexGrow={1}>
          <Typography variant="body2" fontWeight="fontWeightMedium">
            {recipient.account.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Stack>
        <Stack position="relative" height={12}>
          <Fade in={isSelected} mountOnEnter unmountOnExit>
            <FaCheck
              className="check"
              style={{ position: 'absolute', right: 0 }}
            />
          </Fade>
        </Stack>
      </Stack>
    </StyledMenuItem>
  );
};
