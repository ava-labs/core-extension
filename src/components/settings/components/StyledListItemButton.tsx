import { ListItemButton, styled } from '@avalabs/k2-components';

export const StyledListButton = styled(ListItemButton)`
  justify-content: space-between;
  padding: 10px 16px;
  margin: 0;
  &:hover {
    border-radius: 0;
  }
  &.Mui-selected {
    border-radius: 0;
  }
`;
