import { getHexAlpha, SearchInput, styled } from '@avalabs/k2-alpine';

export const SearchField = styled(SearchInput)(({ theme }) => ({
  '& input': {
    backgroundColor: getHexAlpha(theme.palette.text.primary, 10),
  },
}));
