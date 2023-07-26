import { Stack, styled } from '@avalabs/k2-components';

export const NetworkListItem = styled(Stack)<{
  isActive?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s ease-in-out;
  background-color: ${({ isActive, theme }) =>
    isActive ? `${theme.palette.grey[900]}80` : 'inherit'};

  :hover {
    background-color: ${({ theme }) => `${theme.palette.grey[900]}80`};
  }
`;
