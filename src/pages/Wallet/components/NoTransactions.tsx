import {
  SubTextTypography,
  useThemeContext,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';

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

export function NoTransactions() {
  const { darkMode } = useThemeContext();

  return (
    <ContainerWithBg isDarkTheme={!!darkMode}>
      <SubTextTypography size={16}>You have no transactions!</SubTextTypography>
    </ContainerWithBg>
  );
}
