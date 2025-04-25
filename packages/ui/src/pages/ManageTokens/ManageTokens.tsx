import { useState } from 'react';
import { ManageTokensList } from './ManageTokensList';
import { Scrollbars } from '@/components/common/scrollbars/Scrollbars';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import {
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MenuItem,
  MenuList,
  PlusIcon,
  SearchBar,
  Stack,
  Typography,
} from '@avalabs/core-k2-components';

export enum Sort {
  TOKEN_AMOUNT = 'Token Amount',
  NAME = 'Name',
  BALANCE = 'Balance',
}

export const ManageTokens = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  const sortItems = {
    [Sort.TOKEN_AMOUNT]: t('Token Amount'),
    [Sort.NAME]: t('Name'),
    [Sort.BALANCE]: t('Balance'),
  };

  const [selectedSort, setSelectedSort] = useState<Sort>(Sort.TOKEN_AMOUNT);

  function handleSortChange(keyName) {
    setSelectedSort(keyName);
    setShowSortMenu(false);
  }

  const FilterItem = ({ keyName, onClick }) => {
    function onClickHandler() {
      onClick(keyName);
    }
    return (
      <MenuItem
        disableRipple
        onClick={onClickHandler}
        sx={{ height: 32, minHeight: 32 }}
      >
        <Stack
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            variant="body2"
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            title={keyName}
          >
            {keyName}
          </Typography>
          {selectedSort === keyName && <CheckIcon size={12} />}
        </Stack>
      </MenuItem>
    );
  };

  return (
    <Stack sx={{ flex: 1 }}>
      <PageTitle>{t('Manage Tokens')}</PageTitle>
      <Stack sx={{ flexGrow: 1, width: '100%', py: 1, px: 2, rowGap: '30px' }}>
        <SearchBar
          data-testid="search-token-list-input"
          placeholder={t('Search')}
          onChange={(event) => setSearchQuery(event.target.value)}
          autoFocus={true}
        />
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="text"
            data-testid="add-custom-token-button"
            onClick={() => history.push('/manage-tokens/add')}
            sx={{ alignSelf: 'flex-start', padding: 0 }}
          >
            <Stack direction="row" alignItems="center" sx={{ height: '24px' }}>
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ width: '24px', height: '24px' }}
              >
                <PlusIcon size={20} />
              </Stack>
              <Typography sx={{ mx: 1 }}>{t('Add Custom Token')}</Typography>
            </Stack>
          </Button>

          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'flex-end',
              position: 'relative',
            }}
            onClick={() => {
              setShowSortMenu(!showSortMenu);
            }}
            data-testid="filter-activity-menu"
          >
            <Typography
              variant="caption"
              sx={{
                m: '0 8px 0 5px',
                fontWeight: 'fontWeightMedium',
              }}
            >
              {t('Sort By')}: {selectedSort}
            </Typography>
            {showSortMenu ? (
              <ChevronUpIcon size={20} />
            ) : (
              <ChevronDownIcon size={20} />
            )}
            {showSortMenu && (
              <Stack
                sx={{
                  position: 'absolute',
                  top: '30px',
                  right: 0,
                }}
              >
                <MenuList
                  data-testid="sort-list-options"
                  sx={{
                    width: 160,
                    justifyContent: 'flex-start',
                    zIndex: 1,
                    height: 120,
                  }}
                >
                  <Scrollbars
                    style={{ flexGrow: 1, maxHeight: 'unset', height: '100%' }}
                  >
                    {Object.keys(sortItems).map((sortItem) => (
                      <FilterItem
                        key={sortItem}
                        keyName={sortItem}
                        onClick={handleSortChange}
                      />
                    ))}
                  </Scrollbars>
                </MenuList>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Scrollbars style={{ marginBottom: '16px' }}>
          <ManageTokensList searchQuery={searchQuery} sort={selectedSort} />
        </Scrollbars>
      </Stack>
    </Stack>
  );
};
