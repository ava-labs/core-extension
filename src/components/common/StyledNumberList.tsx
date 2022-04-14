import { Typography } from '@avalabs/react-components';
import styled from 'styled-components';

export const StyledNumberList = styled(Typography)`
  display: block;
  background-color: ${({ theme }) => theme.colors.bg3};
  line-height: 24px;
  height: 24px;
  width: 24px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 50%;
  text-align: center;
  padding: 0 6px;
  margin-right: 16px;
`;
