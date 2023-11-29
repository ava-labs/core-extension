import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AccountItem } from './AccountItem';
import {
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  MenuList,
  Scrollbars,
  ScrollbarsRef,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-components';

import { Account, AccountType } from '@src/background/services/accounts/models';
import { MenuFilterItem } from './components/MenuFilterItem';

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

export enum ImportFilterType {
  ALL = 'ALL',
  PRIVATE_KEY = 'PRIVATE_KEY',
  WALLET_CONNECT = 'WALLET_CONNECT',
  FIREBLOCKS = 'FIREBLOCKS',
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
  const theme = useTheme();
  const scrollbarsRef = useRef<ScrollbarsRef>(null);
  const activeAccountRef = useRef<HTMLDivElement>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedImportFilter, setSelectedImportFilter] =
    useState<ImportFilterType>(ImportFilterType.ALL);

  const importFilterTranslatedItems = {
    [ImportFilterType.ALL]: t('All'),
    [ImportFilterType.PRIVATE_KEY]: t('Private Key'),
    [ImportFilterType.WALLET_CONNECT]: t('Wallet Connect'),
    [ImportFilterType.FIREBLOCKS]: t('Fireblocks'),
  };

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

  const filteredImportAccounts = useMemo(() => {
    return accounts.filter((account) => {
      if (selectedImportFilter === ImportFilterType.ALL) {
        return account;
      } else if (selectedImportFilter === ImportFilterType.PRIVATE_KEY) {
        return account.type === AccountType.IMPORTED;
      } else if (selectedImportFilter === ImportFilterType.WALLET_CONNECT) {
        return account.type === AccountType.WALLET_CONNECT;
      } else if (selectedImportFilter === ImportFilterType.FIREBLOCKS) {
        return account.type === AccountType.FIREBLOCKS;
      }
    });
  }, [accounts, selectedImportFilter]);

  function handleImportFilterChange(keyName: ImportFilterType) {
    setSelectedImportFilter(keyName);
    setShowFilterMenu(false);
  }

  {
    return (
      <Stack sx={{ width: '100%' }}>
        {allowDeleting && (
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', pt: 0.5, px: 2 }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                cursor: 'pointer',
                justifyContent: 'flex-end',
                mb: 1,
                mt: 0.5,
                position: 'relative',
              }}
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Typography sx={{ mr: 0.5 }}>
                {t('Filter:')}{' '}
                {importFilterTranslatedItems[selectedImportFilter]}
              </Typography>
              {showFilterMenu ? (
                <ChevronUpIcon size="20" />
              ) : (
                <ChevronDownIcon size="20" />
              )}
            </Stack>
            {showFilterMenu && (
              <MenuList
                sx={{
                  position: 'absolute',
                  mt: 4,
                  p: 0,
                  zIndex: 1,
                  width: 180,
                  justifyContent: 'flex-start',
                  overflow: 'hidden',
                  backgroundColor: theme.palette.grey[850],
                }}
              >
                {(
                  Object.keys(ImportFilterType) as Array<
                    keyof typeof ImportFilterType
                  >
                ).map((importFilterItemName) => {
                  return (
                    <MenuFilterItem
                      key={ImportFilterType[importFilterItemName]}
                      itemText={
                        importFilterTranslatedItems[importFilterItemName]
                      }
                      isSelected={
                        ImportFilterType[importFilterItemName] ===
                        selectedImportFilter
                      }
                      onClick={() =>
                        handleImportFilterChange(
                          ImportFilterType[importFilterItemName]
                        )
                      }
                    />
                  );
                })}
              </MenuList>
            )}
            <Button
              variant="text"
              data-testid="imported-account-delete-button"
              size="small"
              onClick={() => setIsDeleteMode(!isDeleteMode)}
            >
              {!isDeleteMode ? t('Manage Accounts') : t('Close')}
            </Button>
          </Stack>
        )}
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
            {filteredImportAccounts.length === 0 ? (
              <Stack sx={{ justifyContent: 'center', flexGrow: 1, mx: 4 }}>
                <Typography variant="h5" sx={{ textAlign: 'center' }}>
                  <Trans
                    i18nKey="No {{selectedImportFilter}} Accounts"
                    values={{
                      selectedImportFilter:
                        importFilterTranslatedItems[selectedImportFilter],
                    }}
                  />
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textAlign: 'center', color: 'text.secondary' }}
                >
                  <Trans
                    i18nKey="Adjust filter or import wallet using {{selectedImportFilter}} to see imported accounts"
                    values={{
                      selectedImportFilter:
                        importFilterTranslatedItems[selectedImportFilter],
                    }}
                  />
                </Typography>
              </Stack>
            ) : (
              Object.values(filteredImportAccounts).map((account) => (
                <AccountItem
                  key={account.id}
                  ref={
                    activeAccount?.id === account.id ? activeAccountRef : null
                  }
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
              ))
            )}
          </Stack>
        </Scrollbars>
      </Stack>
    );
  }
}
