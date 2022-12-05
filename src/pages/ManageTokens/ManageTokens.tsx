import { useState } from 'react';
import {
  PlusIcon,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { ManageTokensList } from './ManageTokensList';
import { useTheme } from 'styled-components';
import { Scrollbars } from '@src/components/common/scrollbars/Scrollbars';
import { useHistory } from 'react-router-dom';
import { PageTitle } from '@src/components/common/PageTitle';
import { useTranslation } from 'react-i18next';

export const ManageTokens = () => {
  const theme = useTheme();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { t } = useTranslation();

  return (
    <VerticalFlex flex={1}>
      <PageTitle>{t('Manage Token List')}</PageTitle>
      <VerticalFlex grow="1" width="100%" padding="8px 16px">
        <SearchInput
          data-testid="search-token-list-input"
          searchTerm={searchQuery}
          placeholder={t('Search')}
          width="100%"
          onSearch={(term) => setSearchQuery(term)}
          autoFocus={true}
        />
        <TextButton
          data-testid="add-custom-token-button"
          color={theme.colors.text1}
          onClick={() => history.push('/manage-tokens/add')}
          margin="16px 0 24px 0"
        >
          <VerticalFlex
            justify="center"
            align="center"
            width="24px"
            height="24px"
          >
            <PlusIcon color={theme.colors.text1} width="20px" height="20px" />
          </VerticalFlex>
          <Typography margin="0 16px" size={14} height="24px" weight={600}>
            {t('Add a Custom Token')}
          </Typography>
        </TextButton>
        <Scrollbars>
          <ManageTokensList searchQuery={searchQuery} />
        </Scrollbars>
      </VerticalFlex>
    </VerticalFlex>
  );
};
