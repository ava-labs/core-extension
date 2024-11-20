import { t } from 'i18next';
import { useState } from 'react';
import { Collapse, Stack } from '@avalabs/core-k2-components';

import { Account } from '@src/background/services/accounts/models';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { isImportedAccount } from '@src/background/services/accounts/utils/typeGuards';

import { SelectionMode } from '../providers/AccountManagerProvider';
import WalletHeaderNew from './WalletHeader';
import { AccountItem } from './AccountItem';

type AccountListProps = {
  accounts: Account[];
};

export const AccountListImported = ({ accounts }: AccountListProps) => {
  const {
    accounts: { active },
  } = useAccountsContext();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Stack sx={{ pt: 0.75, width: 1 }}>
      <WalletHeaderNew
        name={t('Imported')}
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
