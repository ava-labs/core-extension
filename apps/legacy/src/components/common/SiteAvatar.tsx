import { Stack, styled } from '@avalabs/core-k2-components';

export const SiteAvatar = styled(Stack)<{ margin?: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '8px 0'};
`;
