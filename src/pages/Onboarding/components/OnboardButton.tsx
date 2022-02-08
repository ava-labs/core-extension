import {
  TextButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';

const TextButtonCard = styled(TextButton)`
  border-radius: 8px;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.stroke1};
    background-color: ${({ theme }) => `${theme.colors.bg3}50`};
  }
`;

export function OnboardButton({
  title,
  children,
  onClick,
  margin,
}: {
  title: string;
  children: any;
  onClick: () => void;
  margin?: string;
}) {
  return (
    <TextButtonCard onClick={onClick} margin={margin}>
      <VerticalFlex width="177px" height="176px" align="center">
        <Typography margin="36px 0 24px 0" size={14} height="24px" weight={600}>
          {title}
        </Typography>
        {children}
      </VerticalFlex>
    </TextButtonCard>
  );
}
