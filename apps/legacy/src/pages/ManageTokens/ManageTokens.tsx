import { useState } from 'react';
import { NetworkVMType } from '@avalabs/vm-module-types';
import { ManageTokensList } from './ManageTokensList';
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
  Tooltip,
  Typography,
} from '@avalabs/core-k2-components';
import { FlexScrollbars } from '@/components/common/FlexScrollbars';
import { useNetworkContext } from '@core/ui';

export enum Sort {
  TOKEN_AMOUNT = 'Token Amount',
  NAME = 'Name',
  BALANCE = 'Balance',
}

export const ManageTokens = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { network } = useNetworkContext();
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
          <Tooltip
            title={
              network?.vmName === NetworkVMType.EVM
                ? ''
                : t('Unsupported on the active network')
            }
          >
            <Button
              variant="text"
              data-testid="add-custom-token-button"
              onClick={() => history.push('/manage-tokens/add')}
              sx={{ alignSelf: 'flex-start', padding: 0 }}
              disabled={network?.vmName !== NetworkVMType.EVM}
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{ height: '24px' }}
              >
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
          </Tooltip>

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
                  <FlexScrollbars>
                    {Object.keys(sortItems).map((sortItem) => (
                      <FilterItem
                        key={sortItem}
                        keyName={sortItem}
                        onClick={handleSortChange}
                      />
                    ))}
                  </FlexScrollbars>
                </MenuList>
              </Stack>
            )}
          </Stack>
        </Stack>

        <FlexScrollbars style={{ marginBottom: '8px' }}>
          <ManageTokensList searchQuery={searchQuery} sort={selectedSort} />
        </FlexScrollbars>
      </Stack>
    </Stack>
  );
};
