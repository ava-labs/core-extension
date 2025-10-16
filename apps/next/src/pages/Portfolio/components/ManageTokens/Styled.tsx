import {
  getHexAlpha,
  SearchInput as K2SearchInput,
  styled,
} from '@avalabs/k2-alpine';

export const SearchInput = styled(K2SearchInput)(({ theme }) => ({
  borderRadius: theme.shape.largeBorderRadius,
  backgroundColor: getHexAlpha(
    theme.palette.mode === 'light'
      ? theme.palette.neutral[850]
      : theme.palette.common.white,
    5,
  ),
}));
