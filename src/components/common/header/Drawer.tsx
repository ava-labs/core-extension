import {
  HorizontalFlex,
  VerticalFlex,
  useIsSmallScreen,
  TextButton,
  CloseIcon,
} from '@avalabs/react-components';
import { Logo } from '@src/components/icons/Logo';
import styled, { css, useTheme } from 'styled-components';
import { Menu } from './Menu';

interface DrawerProps {
  open: boolean;
  onCloseClicked: () => void;
}

const Container = styled(VerticalFlex)`
  background-color: ${({ theme }) => theme.colors.bg1};
  position: fixed;
  left: -100%;
  top: 0;
  height: 100vh;
  width: 100%;
  transition: left 0.2s ease-out;
  padding: 27px 5% 27px;
  overflow: hidden;
  z-index: 1;

  ${(props: { expanded: boolean }) =>
    props.expanded &&
    css`
      left: 0;
    `};
`;

export function Drawer({ open, onCloseClicked }: DrawerProps) {
  const isSmallScreen = useIsSmallScreen();
  const theme = useTheme();

  if (!isSmallScreen) {
    return null;
  }

  return (
    <Container expanded={open}>
      <HorizontalFlex justify="space-between" margin="0 0 40px">
        <Logo />
        <TextButton onClick={() => onCloseClicked()}>
          <CloseIcon fill={theme.colors.text1} height="21px" />
        </TextButton>
      </HorizontalFlex>
      <Menu />
    </Container>
  );
}
