import { useState } from 'react';
import {
  Button,
  Collapse,
  Grow,
  OutboundIcon,
  Stack,
} from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

import { SecretType } from '@src/background/services/secrets/models';
import { WalletDetails } from '@src/background/services/wallet/models';
import { PrimaryAccount } from '@src/background/services/accounts/models';

import { useWalletTotalBalance } from '../hooks/useWalletTotalBalance';
import { SelectionMode } from '../providers/AccountManagerProvider';
import { AccountItem } from './AccountItem';
import WalletHeader from './WalletHeader';
import { useNetworkContext } from '@src/contexts/NetworkProvider';

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
  const { isDeveloperMode } = useNetworkContext();
  const [isExpanded, setIsExpanded] = useState(true);
  const {
    isLoading,
    // hasBalanceOfUnknownFiatValue,
    hasBalanceOnUnderivedAccounts,
    // hasErrorOccurred,
    totalBalanceInCurrency,
  } = useWalletTotalBalance(walletDetails);

  return (
    <Stack sx={{ pt: 0.75, width: 1 }}>
      <WalletHeader
        walletDetails={walletDetails}
        isActive={isActive}
        isExpanded={isExpanded}
        isLoading={isLoading}
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
        <Grow in={hasBalanceOnUnderivedAccounts}>
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
                  `https://${
                    isDeveloperMode ? 'test.' : ''
                  }core.app/tools/utxo-manager`,
                  '_blank',
                  'noreferrer'
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
