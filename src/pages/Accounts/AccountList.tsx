import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountItem } from './AccountItem';
import {
  Button,
  Divider,
  Scrollbars,
  ScrollbarsRef,
  Stack,
} from '@avalabs/k2-components';

import { Account } from '@src/background/services/accounts/models';

export interface AccountListProps {
  accounts: Account[];
  activeAccount?: Account;
  onAccountClicked: (account: Account) => Promise<void>;
  // Editing-related
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  // Deleting-related
  allowDeleting: boolean;
  isDeleteMode: boolean;
  setIsDeleteMode: (status: boolean) => void;
  deleteIdList: string[];
  setDeleteIdList: Dispatch<SetStateAction<string[]>>;
}

export function AccountList({
  isEditing,
  accounts,
  activeAccount,
  allowDeleting,
  onAccountClicked,
  setIsEditing,
  isDeleteMode,
  setIsDeleteMode,
  deleteIdList,
  setDeleteIdList,
}: AccountListProps) {
  const { t } = useTranslation();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);
  const activeAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make sure the active account element is visible after switching tabs
    // or active account.
    if (scrollbarsRef.current && activeAccountRef.current) {
      const containerTop = scrollbarsRef.current.getScrollTop();
      const containerBottom =
        containerTop + scrollbarsRef.current.getClientHeight();

      const { offsetTop: elementTop, clientHeight: elementHeight } =
        activeAccountRef.current;
      const elementBottom = elementTop + elementHeight;

      if (elementTop < containerTop) {
        // If active account's top is not visible, align it with the top of the viewport
        activeAccountRef.current.scrollIntoView();
      } else if (elementBottom > containerBottom) {
        // If active account's bottom is not visible, align it with the bottom of the viewport
        activeAccountRef.current.scrollIntoView(false);
      }
    }
  }, [activeAccount]);

  const toggleItem = (id: string) => {
    if (deleteIdList.indexOf(id) > -1) {
      const newList = deleteIdList.filter((currentId) => currentId !== id);
      setDeleteIdList(newList);
      return;
    }
    setDeleteIdList([...deleteIdList, id]);
  };

  {
    return (
      <Stack sx={{ width: '100%' }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'flex-end', pt: 0.5, px: 2 }}
        >
          {allowDeleting && (
            <Button
              variant="text"
              data-testid="imported-account-delete-button"
              size="small"
              onClick={() => setIsDeleteMode(!isDeleteMode)}
            >
              {!isDeleteMode ? t('Manage Accounts') : t('Close')}
            </Button>
          )}
        </Stack>
        <Scrollbars
          style={{
            flexGrow: 1,
            maxHeight: 'unset',
            height: '100%',
            width: '100%',
          }}
          autoHide={false}
          ref={scrollbarsRef}
        >
          <Stack
            sx={{ flexGrow: 1, height: '100%', pb: 2 }}
            divider={<Divider sx={{ mx: 2 }} />}
          >
            {Object.values(accounts).map((account) => (
              <AccountItem
                key={account.id}
                ref={activeAccount?.id === account.id ? activeAccountRef : null}
                account={account}
                onClick={() =>
                  !isDeleteMode && !isEditing && onAccountClicked(account)
                }
                toggle={toggleItem}
                isChecked={deleteIdList.includes(account.id)}
                isDeleteMode={isDeleteMode}
                editing={isEditing}
                onEditStart={() => setIsEditing(true)}
                onEditEnd={() => setIsEditing(false)}
              />
            ))}
          </Stack>
        </Scrollbars>
      </Stack>
    );
  }
}
