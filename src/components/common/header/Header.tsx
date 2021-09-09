import styled, { useTheme } from 'styled-components';
import Menu from './Menu';
import {
  HamburgerIcon,
  HorizontalFlex,
  TextButton,
  useIsSmallScreen,
  VerticalFlex,
} from '@avalabs/react-components';
import React, { useState } from 'react';
import Drawer from './Drawer';
import { Logo } from '@src/components/icons/Logo';

interface HeaderProps {
  onDrawerStateChanged?: (open: boolean) => void;
}

function Header({ onDrawerStateChanged }: HeaderProps) {
  const isSmallScreen = useIsSmallScreen();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const openDrawer = () => {
    setDrawerOpen(true);
    onDrawerStateChanged?.(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    onDrawerStateChanged?.(false);
  };

  return (
    <>
      <VerticalFlex align="center">
        <HorizontalFlex
          padding="24px 0"
          maxWidth="90%"
          width="1200px"
          justify="space-between"
          align="center"
        >
          <Logo />
          {isSmallScreen ? (
            <HorizontalFlex>
              <TextButton onClick={() => openDrawer()} margin="0 0 0 23px">
                <HamburgerIcon color={theme.colors.text} height="27px" />
              </TextButton>
            </HorizontalFlex>
          ) : (
            <HorizontalFlex align={'center'} position="relative">
              <Menu />
            </HorizontalFlex>
          )}
        </HorizontalFlex>
        <Drawer open={drawerOpen} onCloseClicked={closeDrawer} />
      </VerticalFlex>
    </>
  );
}

export default Header;
