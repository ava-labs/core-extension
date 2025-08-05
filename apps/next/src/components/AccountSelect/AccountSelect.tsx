import { Divider } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useState } from 'react';

import { AddressType } from '@core/types';

import { Card } from '@/components/Card';
import { SearchableSelect } from '@/components/SearchableSelect';

import { AccountGroup } from './components/AccountGroup';
import { SelectedAccount } from './components/SelectedAccount';
import { AccountGroup as AccountGroupT } from './types';
import { useFocusableItemIds, useGroupedAccounts } from './hooks';

type AccountSelectProps = {
  addressType: AddressType;
  value: string;
  onValueChange: (accountId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

const SEARCH_INPUT_ID = 'from-address-search-input';
const SEARCH_INPUT_PROPS = {
  slotProps: {
    htmlInput: {
      'data-item-id': SEARCH_INPUT_ID,
    },
  },
};

export const AccountSelect: FC<AccountSelectProps> = ({
  addressType,
  value,
  onValueChange,
  query,
  onQueryChange,
}) => {
  const { t } = useTranslation();

  const groupedAccounts = useGroupedAccounts(addressType, query);
  const focusableItemIds = useFocusableItemIds(
    groupedAccounts,
    SEARCH_INPUT_ID,
  );

  const [open, setOpen] = useState(false);

  const onItemChosen = useCallback(
    (accountId: string) => {
      setOpen(false);
      onValueChange(accountId);
    },
    [onValueChange],
  );

  return (
    <Card>
      <SearchableSelect
        selectProps={{
          open,
          value,
          label: t('Account'),
          onOpen: () => setOpen(true),
          onClose: () => setOpen(false),
          // FIXME: For some reason without the `onClick` here, the menu does not
          // close after the first click on the backdrop, but only after a 2nd click.
          onClick: () => setOpen(false),
          renderValue: (val) => <SelectedAccount accountId={val as string} />,
        }}
        withSearchInput
        searchInputId={SEARCH_INPUT_ID}
        searchInputProps={{
          ...SEARCH_INPUT_PROPS,
          defaultValue: query,
          onChange: (ev) => onQueryChange(ev.target.value),
        }}
        focusableItemIds={focusableItemIds}
      >
        {groupedAccounts.map((group, index, { length }) => [
          <AccountGroup
            group={group as AccountGroupT}
            key={group.id}
            addressType={addressType}
            selectedAccountId={value}
            onAccountClick={onItemChosen}
          />,
          index !== length - 1 ? <Divider /> : null,
        ])}
      </SearchableSelect>
    </Card>
  );
};
