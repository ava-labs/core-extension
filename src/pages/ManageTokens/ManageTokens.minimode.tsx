import React, { useState } from 'react';
import {
  PlusIcon,
  SearchInput,
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import {
  PageContentMiniMode,
  PageTitleMiniMode,
} from '@src/pages/ManageTokens/Page.minimode';
import { ManageTokensList } from './ManageTokensList.minimode';
import { BottomNav } from '@src/components/common/BottomNav.minimode';
import styled, { useTheme } from 'styled-components';
import Scrollbars from 'react-custom-scrollbars';
import { useHistory } from 'react-router-dom';

const StyledSearchInput = styled(SearchInput)`
  margin-top: 12px;
  margin-bottom: 8px;
`;

export const ManageTokensMiniMode = () => {
  const theme = useTheme();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <VerticalFlex flex={1} padding={'0 0 65px'}>
        <PageTitleMiniMode showBack>Manage token list</PageTitleMiniMode>
        <PageContentMiniMode>
          <StyledSearchInput
            searchTerm={searchQuery}
            placeholder="Search"
            width="100%"
            onSearch={(term) => setSearchQuery(term)}
            autoFocus={true}
          />
          <Scrollbars>
            <TextButton
              color={theme.colors.text1}
              onClick={() => history.push('/manage-tokens/add')}
              margin="16px 0 8px 0"
            >
              <VerticalFlex
                justify="center"
                align="center"
                width="32px"
                height="32px"
              >
                <PlusIcon
                  color={theme.colors.text1}
                  width="20px"
                  height="20px"
                />
              </VerticalFlex>
              <Typography margin="0 16px" size={14} weight={600}>
                Add a custom token
              </Typography>
            </TextButton>
            <ManageTokensList searchQuery={searchQuery} />
          </Scrollbars>
        </PageContentMiniMode>
      </VerticalFlex>
      <BottomNav />
    </>
  );
};
