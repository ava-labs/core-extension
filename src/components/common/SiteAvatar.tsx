import { VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';
import { Stack, styled as k2Styled } from '@avalabs/k2-components';

export const SiteAvatar = styled(VerticalFlex)<{ margin?: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '8px 0'};
`;

// TODO: remove the old one and rename this to SiteAvatar when all occurrences are replaced
export const SiteAvatarK2 = k2Styled(Stack)<{ margin?: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '8px 0'};
`;
