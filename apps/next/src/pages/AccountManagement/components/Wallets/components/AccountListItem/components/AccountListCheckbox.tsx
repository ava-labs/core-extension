import CheckIcon from '@/components/CheckIcon';
import { Checkbox as K2Checkbox, Slide } from '@avalabs/k2-alpine';
import { Account } from '@core/types';
import { useAccountManager } from '@core/ui';
import { FC, useState } from 'react';

interface Props {
  account: Account;
  active: boolean;
}

export const AccountListCheckbox: FC<Props> = ({ account, active }) => {
  const { isManageMode, selectedAccounts, isAccountSelectable } =
    useAccountManager();

  const [showCheckbox, setShowCheckbox] = useState(isManageMode);

  const disabled = !isAccountSelectable(account);

  return (
    <>
      <Slide
        direction="right"
        in={isManageMode && showCheckbox}
        mountOnEnter
        unmountOnExit
        onExited={() => setShowCheckbox(false)}
      >
        <K2Checkbox
          tabIndex={-1}
          checked={selectedAccounts.includes(account.id)}
          disabled={disabled}
        />
      </Slide>
      <Slide
        direction="right"
        in={!isManageMode && !showCheckbox}
        appear={false}
        mountOnEnter
        unmountOnExit
        onExited={() => setShowCheckbox(true)}
      >
        <CheckIcon size={11} color={active ? 'currentColor' : 'transparent'} />
      </Slide>
    </>
  );
};
