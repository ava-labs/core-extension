import {
  SubTextTypography,
  Typography,
  useThemeContext,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';

const ContainerWithBg = styled(VerticalFlex)<{ isDarkTheme: boolean }>`
  background: ${({ isDarkTheme }) =>
    isDarkTheme
      ? `url(images/illustrations/no-transactions-dark.png)`
      : `url(images/illustrations/no-transactions-light.png)`};
  width: 100%;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 0 0 75px;
`;

type NoTransactionsProps = {
  isEmbedded: boolean;
};

export function NoTransactions({ isEmbedded = false }: NoTransactionsProps) {
  const { darkMode } = useThemeContext();
  const theme = useTheme();

  if (isEmbedded) {
    return (
      <VerticalFlex justify="center" align="center" grow="1">
        <Typography size={18} weight={600}>
          No recent activity
        </Typography>
        <Typography
          size={14}
          weight={400}
          margin="16px 0"
          color={theme.colors.text2}
        >
          New transactions will show here
        </Typography>
      </VerticalFlex>
    );
  }
  return (
    <ContainerWithBg isDarkTheme={!!darkMode}>
      <SubTextTypography size={16}>You have no transactions!</SubTextTypography>
    </ContainerWithBg>
  );
}
