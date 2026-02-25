import { useState } from 'react';

import { useAccountsContext } from '@core/ui';

import { AccountSelect } from '@/components/AccountSelect';

import { useFusionState } from '../contexts';

export const SwapAccountSelect = () => {
  const {
    accounts: { active },
    selectAccount,
  } = useAccountsContext();

  const { updateQuery } = useFusionState();

  const [accountQuery, setAccountQuery] = useState('');

  return (
    <AccountSelect
      addressType="C"
      value={active}
      isBalanceVisible={false}
      query={accountQuery}
      onValueChange={(newAccount) => {
        selectAccount(newAccount.id);

        // Clear all filters when account is changed
        updateQuery({
          userAmount: '',
          from: '',
          to: '',
          fromQuery: '',
          toQuery: '',
        });
      }}
      onQueryChange={(q) => setAccountQuery(q)}
    />
  );
};
