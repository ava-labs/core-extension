import { TextButton, VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';

const TextButtonCard = styled(TextButton)`
  border: 1px solid ${({ theme }) => theme.colors.stroke1};
  border-radius: 8px;
  background-color: ${({ theme }) => `${theme.colors.bg3}40`};
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.bg3}50`};
  }
`;

export function OnboardButton({
  children,
  onClick,
  margin,
}: {
  children: any;
  onClick: () => void;
  margin?: string;
}) {
  return (
    <TextButtonCard onClick={onClick} margin={margin}>
      <VerticalFlex width="248px" height="240px" align="center">
        {children}
      </VerticalFlex>
    </TextButtonCard>
  );
}
