import {
  ComponentSize,
  HorizontalFlex,
  HorizontalSeparator,
  TextButton,
  VerticalFlex,
} from '@avalabs/react-components';
import { AccountType } from '@src/background/services/accounts/models';
import { EmptyContent } from '@src/components/common/EmptyContent';
import { useAccountsContext } from '@src/contexts/AccountsProvider';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { AccountItem } from './AccountItem';
import { AccountListProps } from './Accounts';
import {
  Scrollbars,
  ScrollbarsRef,
} from '@src/components/common/scrollbars/Scrollbars';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { OuterContainer } from '../Networks/common/OuterContainer';

interface ImportedListProps extends AccountListProps {
  isDeleteMode: boolean;
  setIsDeleteMode: (status: boolean) => void;
  deleteIdList: string[];
  setDeleteIdList: Dispatch<SetStateAction<string[]>>;
}

export function ImportedList({
  isEditing,
  onAccountClicked,
  setIsEditing,
  isDeleteMode,
  setIsDeleteMode,
  deleteIdList,
  setDeleteIdList,
}: ImportedListProps) {
  const theme = useTheme();
  const {
    accounts: { imported: importedAccounts, active: activeAccount },
  } = useAccountsContext();
  const { t } = useTranslation();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);

  const hasImportedAccounts = !!Object.keys(importedAccounts).length;

  useEffect(() => {
    if (activeAccount && activeAccount.type === AccountType.IMPORTED) {
      const activeAccountIndex = Object.values(importedAccounts).findIndex(
        (account) => {
          return account.id === activeAccount.id;
        }
      );

      scrollbarsRef.current?.scrollTop(50 * activeAccountIndex);
    }
  }, [activeAccount, importedAccounts]);

  const setDeleteId = (id: string) => {
    if (deleteIdList.indexOf(id) > -1) {
      const newList = deleteIdList.filter((currentId) => currentId !== id);
      setDeleteIdList(newList);
      return;
    }
    setDeleteIdList([...deleteIdList, id]);
  };

  {
    return (
      <>
        <HorizontalFlex justify="flex-end" padding="8px 16px">
          {hasImportedAccounts && (
            <TextButton
              data-testid="imported-account-delete-button"
              size={ComponentSize.SMALL}
              margin="0 0 0 8px"
              onClick={() => setIsDeleteMode(!isDeleteMode)}
            >
              {!isDeleteMode ? t('Delete') : t('Cancel Delete')}
            </TextButton>
          )}
        </HorizontalFlex>
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
          <VerticalFlex padding="0 0 16px 0" grow="1" height="100%">
            {!hasImportedAccounts && (
              <EmptyContent text={t('There is no imported account yet.')} />
            )}
            {hasImportedAccounts && (
              <TransitionGroup>
                {Object.values(importedAccounts).map((account, i) => {
                  return (
                    <CSSTransition
                      key={account.id}
                      timeout={500}
                      classNames="item"
                    >
                      <OuterContainer
                        data-testid={`account-${i}`}
                        key={account.addressC}
                        onClick={() =>
                          !isEditing && onAccountClicked(account.id)
                        }
                        width="100%"
                      >
                        <AccountItem
                          account={{ ...account }}
                          editing={isEditing}
                          onEdit={() => setIsEditing(true)}
                          onSave={() => setIsEditing(false)}
                          setDeleteId={setDeleteId}
                          isDelete={deleteIdList.includes(account.id)}
                          isDeleteMode={isDeleteMode}
                        />
                        {i < Object.keys(importedAccounts).length - 1 && (
                          <HorizontalSeparator
                            color={`${theme.colors.bg3}80`}
                            margin="0 16px"
                            width="auto"
                          />
                        )}
                      </OuterContainer>
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            )}
          </VerticalFlex>
        </Scrollbars>
      </>
    );
  }
}
