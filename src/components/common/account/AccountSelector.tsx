import { SecondaryOverlay } from '@avalabs/react-components';
import { useState } from 'react';
import { AccountDropdownContent } from './AccountDropdownContent';
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
        <SecondaryOverlay padding="24px 8px" onClick={() => setOpen(false)}>
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
