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
import { PageTitleMiniMode } from '@src/components/common/PageTitle';

export const ManageTokens = () => {
  const theme = useTheme();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <VerticalFlex flex={1}>
      <PageTitleMiniMode>Manage Token List</PageTitleMiniMode>
      <VerticalFlex grow="1" width="100%" padding="8px 16px">
        <SearchInput
          searchTerm={searchQuery}
          placeholder="Search"
          width="100%"
          onSearch={(term) => setSearchQuery(term)}
          autoFocus={true}
        />
        <TextButton
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
            Add a custom token
          </Typography>
        </TextButton>
        <Scrollbars>
          <ManageTokensList searchQuery={searchQuery} />
        </Scrollbars>
      </VerticalFlex>
    </VerticalFlex>
  );
};
