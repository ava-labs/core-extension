import { Divider } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { FC, Fragment, useMemo, useState } from 'react';

import { AddressType } from '@core/types';

import { AddressField } from '../AddressField';
import { WalletAccounts } from './WalletAccounts';
import { useGroupedAccounts } from './hooks/useGroupedAccounts';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { SelectedAccount } from './SelectedAccount';

type FromAddressFieldProps = {
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

export const FromAddressField: FC<FromAddressFieldProps> = ({
  addressType,
  value,
  onValueChange,
  query,
  onQueryChange,
}) => {
  const { t } = useTranslation();

  const walletsWithAccounts = useGroupedAccounts(addressType, query);

  const itemIds = useMemo(
    () => [
      SEARCH_INPUT_ID,
      ...walletsWithAccounts.flatMap((wallet) => [
        wallet.id,
        ...wallet.accounts.map((account) => account.id),
      ]),
    ],
    [walletsWithAccounts],
  );

  const [menuElement, setMenuElement] = useState<HTMLDivElement | null>(null);
  const keyboardShortcuts = useKeyboardNavigation(
    menuElement,
    itemIds,
    SEARCH_INPUT_ID,
  );

  const [open, setOpen] = useState(false);

  const onItemChosen = (accountId: string) => {
    setOpen(false);
    onValueChange(accountId);
  };

  return (
    <AddressField
      {...keyboardShortcuts}
      selectProps={{
        open,
        value,
        label: t('Account'),
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
        renderValue: (val) => <SelectedAccount accountId={val as string} />,
        MenuProps: {
          ref: setMenuElement,
        },
      }}
      withSearchInput
      searchInputProps={{
        ...SEARCH_INPUT_PROPS,
        defaultValue: query,
        onChange: (ev) => onQueryChange(ev.target.value),
      }}
    >
      {walletsWithAccounts.map((wallet, index, { length }) => (
        <Fragment key={wallet.id}>
          <WalletAccounts
            wallet={wallet as any} // TODO: fix this
            selectedAccountId={value}
            addressType={addressType}
            onAccountClick={onItemChosen}
          />
          {index !== length - 1 && <Divider />}
        </Fragment>
      ))}
    </AddressField>
  );
};
