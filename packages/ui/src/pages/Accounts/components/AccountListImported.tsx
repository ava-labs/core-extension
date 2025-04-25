import { Collapse, Stack } from '@avalabs/core-k2-components';
import { useState } from 'react';

import { useAccountsContext } from '@/contexts/AccountsProvider';
import { Account, IMPORTED_ACCOUNTS_WALLET_ID } from '@core/types';
import { isImportedAccount } from '@core/utils';

import { useTranslation } from 'react-i18next';
import { useWalletTotalBalance } from '../hooks/useWalletTotalBalance';
import { SelectionMode } from '../providers/AccountManagerProvider';
import { AccountItem } from './AccountItem';
import WalletHeader from './WalletHeader';

type AccountListProps = {
  accounts: Account[];
};

export const AccountListImported = ({ accounts }: AccountListProps) => {
  const {
    accounts: { active },
  } = useAccountsContext();
	const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const { isLoading, hasErrorOccurred, totalBalanceInCurrency } =
    useWalletTotalBalance(IMPORTED_ACCOUNTS_WALLET_ID);

  return (
    <Stack sx={{ pt: 0.75, width: 1 }}>
      <WalletHeader
        name={t('Imported')}
        isLoading={isLoading}
        hasBalanceError={hasErrorOccurred}
        totalBalance={totalBalanceInCurrency}
        isActive={isImportedAccount(active)}
        isExpanded={isExpanded}
        toggle={() => setIsExpanded((e) => !e)}
      />
      <Collapse timeout={200} in={isExpanded}>
        <Stack sx={{ width: 1, gap: 1, px: 2 }}>
          {accounts.map((account) => (
            <AccountItem
              key={account.id}
              account={account}
              selectionMode={SelectionMode.Any}
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
