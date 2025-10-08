import { useState } from 'react';
import {
  Button,
  Collapse,
  Grow,
  OutboundIcon,
  Stack,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { SecretType, WalletDetails, PrimaryAccount } from '@core/types';

import { useWalletTotalBalance } from '@core/ui';
import { SelectionMode } from '@core/ui';
import { AccountItem } from './AccountItem';
import WalletHeader from './WalletHeader';

export const WalletContainer = ({
  walletDetails,
  isActive,
  accounts,
}: {
  activeAccountId?: string;
  walletDetails: WalletDetails;
  isActive: boolean;
  accounts: PrimaryAccount[];
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    isLoading,
    hasErrorOccurred,
    totalBalanceInCurrency,
    hasBalanceOnUnderivedAccounts,
  } = useWalletTotalBalance(walletDetails.id);

  return (
    <Stack sx={{ pt: 0.75, width: 1 }}>
      <WalletHeader
        walletDetails={walletDetails}
        isActive={isActive}
        isExpanded={isExpanded}
        isLoading={isLoading}
        hasBalanceError={hasErrorOccurred}
        totalBalance={totalBalanceInCurrency}
        toggle={() => setIsExpanded((e) => !e)}
      />
      <Collapse timeout={200} in={isExpanded}>
        <Stack sx={{ width: 1, gap: 1, px: 2 }}>
          {accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              selectionMode={
                walletDetails.type === SecretType.Seedless
                  ? SelectionMode.None
                  : SelectionMode.Consecutive
              }
              walletType={walletDetails?.type}
            />
          ))}
        </Stack>
        <Grow in={isActive && hasBalanceOnUnderivedAccounts}>
          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              px: 2,
              mt: 1,
            }}
          >
            <Button
              size="small"
              variant="text"
              onClick={() => {
                window.open(
                  `https://core.app/portfolio/wallet/p-chain/utxos`,
                  '_blank',
                  'noreferrer',
                );
              }}
              endIcon={<OutboundIcon />}
            >
              {t('View P-Chain Details')}
            </Button>
          </Stack>
        </Grow>
      </Collapse>
    </Stack>
  );
};
