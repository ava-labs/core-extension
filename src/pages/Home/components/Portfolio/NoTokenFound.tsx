import {
  Typography,
  useThemeContext,
  VerticalFlex,
} from '@avalabs/react-components';
import styled from 'styled-components';

const ContainerWithBg = styled(VerticalFlex)<{ isDarkTheme: boolean }>`
  background: ${({ isDarkTheme }) =>
    isDarkTheme
      ? `url(images/illustrations/no-token-found-dark.png)`
      : `url(images/illustrations/no-token-found-light.png)`};
  background-repeat: no-repeat;
  width: 100%;
  flex-grow: 1;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 16px 110px;
`;

export function NoTokenFound() {
  const { darkMode } = useThemeContext();

  return (
    <ContainerWithBg isDarkTheme={!!darkMode}>
      <Typography>No results found</Typography>
    </ContainerWithBg>
  );
}
