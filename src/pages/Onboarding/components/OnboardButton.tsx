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
      <VerticalFlex
        width="232px"
        padding="36px 0"
        align="center"
        justify="center"
        gap="24px"
      >
        <Typography size={16} height="24px" weight={600}>
          {title}
        </Typography>
        {children}
      </VerticalFlex>
    </TextButtonCard>
  );
}

const StyledTermsButton = styled(TextButton)`
  height: 40px;
  margin: 46px 0 0 0;
  font-size: 12px;
`;

export const TermsButton = () => (
  <StyledTermsButton disabled>Terms and Conditions</StyledTermsButton>
);
