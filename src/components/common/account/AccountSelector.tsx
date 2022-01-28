import { SecondaryOverlay } from '@avalabs/react-components';
import { useState } from 'react';
import { AccountDropdownContent } from './AccountDopdownContent';
import { AccountSelectorButton } from './AccountSelectorButton';

export function AccountSelector() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <AccountSelectorButton
        onClick={() => {
          setOpen(true);
        }}
      />
      {open && (
        <SecondaryOverlay padding="24px 16px">
          <AccountDropdownContent
            onClose={() => {
              setOpen(false);
            }}
          />
        </SecondaryOverlay>
      )}
    </>
  );
}
