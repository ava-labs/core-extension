import { VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

export const SiteAvatar = styled(VerticalFlex)<{ margin?: string }>`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.colors.bg2};
  border-radius: 50%;
  margin: ${({ margin }) => margin ?? '8px 0'};
`;
