import React from 'react';
import {
  HorizontalFlex,
  VerticalFlex,
  useIsSmallScreen,
  TextButton,
  CloseIcon,
} from '@avalabs/react-components';
import { Logo } from '@src/components/icons/Logo';
import styled, { css, useTheme } from 'styled-components';
import Menu from './Menu';

interface DrawerProps {
  open: boolean;
  onCloseClicked: () => void;
}

const Container = styled(VerticalFlex)`
  background-color: ${({ theme }) => theme.colors.bg};
  position: fixed;
  left: -100%;
  top: 0;
  height: 100vh;
  width: 100%;
  transition: left 0.2s ease-out;
  padding: 27px 5% 112px;
  overflow: hidden;

  ${(props: { expanded: boolean }) =>
    props.expanded &&
    css`
      left: 0;
    `};
`;

function Drawer({ open, onCloseClicked }: DrawerProps) {
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
          <CloseIcon fill={theme.colors.text1} size={21} />
        </TextButton>
      </HorizontalFlex>
      <Menu />
    </Container>
  );
}

export default Drawer;
