import { DropDownMenu } from '@avalabs/react-components';
import { AccountDropdownContent } from './AccountDopdownContent';
import { AccountSelectorButton } from './AccountSelectorButton';

export function AccountSelector() {
  return (
    <DropDownMenu
      coords={{
        right: '32px',
        top: '60px',
      }}
      icon={<AccountSelectorButton />}
    >
      <AccountDropdownContent />
    </DropDownMenu>
  );
}
