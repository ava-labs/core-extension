import { SearchBar, Stack } from '@avalabs/core-k2-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle';
import { Scrollbars } from '@/components/common/scrollbars/Scrollbars';
import { ManageCollectiblesList } from './ManageCollectiblesList';

export const ManageCollectibles = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <Stack sx={{ flex: 1 }}>
      <PageTitle>{t('Manage Collectibles')}</PageTitle>
      <Stack
        sx={{
          flexGrow: 1,
          width: '100%',
          py: 1,
          px: 2,
          rowGap: '30px',
        }}
      >
        <SearchBar
          data-testid="search-collectibles-list-input"
          placeholder={t('Search')}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          autoFocus={true}
        />
        <Scrollbars style={{ marginBottom: '16px' }}>
          <ManageCollectiblesList searchQuery={searchQuery} />
        </Scrollbars>
      </Stack>
    </Stack>
  );
};
