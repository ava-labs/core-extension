import React, { useState } from 'react';
import {
  DropDownMenu,
  HamburgerIcon,
  PrimaryIconButton,
  VerticalFlex,
} from '@avalabs/react-components';
import styled, { useTheme } from 'styled-components';
import { MainPage } from './pages/MainPage';
import { Currencies } from './pages/Currencies';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { SettingsPages } from './models';

const OuterContainer = styled(VerticalFlex)`
  overflow-x: hidden;
`;

const AnimatedContainer = styled(VerticalFlex)`
  &.slideLeft-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  &.slideRight-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  &.slideLeft-exit,
  &.slideRight-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.slideLeft-enter-active,
  &.slideRight-enter-active {
    opacity: 1;
    transform: translateX(0%);
  }
  &.slideLeft-exit-active {
    opacity: 0;
    transform: translateX(100%);
  }
  &.slideRight-exit-active {
    opacity: 0;
    transform: translateX(-100%);
  }
  &.slideLeft-enter-active,
  &.slideLeft-exit-active,
  &.slideRight-enter-active,
  &.slideRight-exit-active {
    transition: opacity 300ms, transform 300ms;
  }
`;
enum NavAction {
  NAVIGATE_TO = 'NAVIGATE_TO',
  GO_BACK = 'GO_BACK',
}

export function SettingsMenu() {
  const theme = useTheme();
  const [navStack, setNavStack] = useState<SettingsPages[]>([
    SettingsPages.MAIN_PAGE,
  ]);
  const [lastNavAction, setLastNavAction] = useState<NavAction>();
  const currentPage = navStack[navStack.length - 1];

  const goBack = () => {
    console.log(navStack);
    if (navStack.length === 1) {
      return;
    }
    const newStack = navStack.slice(0, -1) || [];
    setNavStack([...newStack]);
    setLastNavAction(NavAction.GO_BACK);
  };

  const navigateTo = (page: SettingsPages) => {
    setNavStack([...navStack, page]);
    setLastNavAction(NavAction.NAVIGATE_TO);
  };

  let pageElement: JSX.Element | null = null;
  switch (currentPage) {
    case SettingsPages.CURRENCIES:
      pageElement = <Currencies navigateTo={navigateTo} goBack={goBack} />;
      break;
    default:
      pageElement = <MainPage navigateTo={navigateTo} goBack={goBack} />;
  }

  return (
    <DropDownMenu
      coords={{
        right: '0px',
        top: '60px',
      }}
      icon={
        <PrimaryIconButton>
          <HamburgerIcon color={theme.colors.text} />
        </PrimaryIconButton>
      }
    >
      <OuterContainer>
        <SwitchTransition>
          <CSSTransition
            key={currentPage}
            addEndListener={(node, done) =>
              node.addEventListener('transitionend', done, false)
            }
            classNames={
              lastNavAction === NavAction.NAVIGATE_TO
                ? 'slideRight'
                : 'slideLeft'
            }
          >
            <AnimatedContainer
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {pageElement}
            </AnimatedContainer>
          </CSSTransition>
        </SwitchTransition>
      </OuterContainer>
    </DropDownMenu>
  );
}
