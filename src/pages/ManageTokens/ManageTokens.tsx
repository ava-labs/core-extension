import { useState } from 'react';
import { ManageTokensList } from './ManageTokensList';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';
import {
  Button,
  PlusIcon,
  SearchBar,
  Stack,
  Typography,
} from '@avalabs/k2-components';

export const ManageTokens = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();

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
        <Scrollbars style={{ marginBottom: '16px' }}>
          <ManageTokensList searchQuery={searchQuery} />
        </Scrollbars>
      </Stack>
    </Stack>
  );
};
