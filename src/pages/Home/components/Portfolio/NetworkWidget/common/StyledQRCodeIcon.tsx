import { QRCodeIcon } from '@avalabs/react-components';
import styled from 'styled-components';

export const StyledQRCodeIcon = styled(QRCodeIcon)`
  width: 16px;
  border-color: ${({ theme }) => theme.colors.icon1};
  margin: 0 8px 0 0;
`;
