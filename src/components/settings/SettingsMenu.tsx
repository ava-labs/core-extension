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
import { SecurityAndPrivacy } from './pages/SecurityAndPrivacy';
import { ChangePassword } from './pages/ChangePassword';
import { RecoveryPhrase } from './pages/RecoveryPhrase';

const OuterContainer = styled(VerticalFlex)`
  overflow: hidden;
  height: 504px;
`;

const AnimatedContainer = styled(VerticalFlex)`
  height: 100%;
  max-height: 100%;

  &.slideRight-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  &.slideRight-exit {
    opacity: 1;
    transform: translateX(0%);
  }
  &.slideRight-enter-active {
    opacity: 1;
    transform: translateX(0%);
  }
  &.slideRight-exit-active {
    opacity: 0;
    transform: translateX(100%);
  }
  &.slideRight-enter-active,
  &.slideRight-exit-active {
    transition: opacity 300ms, transform 300ms;
  }
`;

export function SettingsMenu() {
  const theme = useTheme();
  const [navStack, setNavStack] = useState<SettingsPages[]>([
    SettingsPages.MAIN_PAGE,
  ]);
  const currentPage = navStack[navStack.length - 1];

  const goBack = () => {
    if (navStack.length === 1) {
      return;
    }
    const newStack = navStack.slice(0, -1) || [];
    setNavStack([...newStack]);
  };

  const navigateTo = (page: SettingsPages) => {
    setNavStack([...navStack, page]);
  };

  let pageElement: JSX.Element | null = null;
  switch (currentPage) {
    case SettingsPages.CURRENCIES:
      pageElement = <Currencies navigateTo={navigateTo} goBack={goBack} />;
      break;
    case SettingsPages.SECURITY_AND_PRIVACY:
      pageElement = (
        <SecurityAndPrivacy navigateTo={navigateTo} goBack={goBack} />
      );
      break;
    case SettingsPages.CHANGE_PASSWORD:
      pageElement = <ChangePassword navigateTo={navigateTo} goBack={goBack} />;
      break;
    case SettingsPages.RECOVERY_PHRASE:
      pageElement = <RecoveryPhrase navigateTo={navigateTo} goBack={goBack} />;
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
            classNames={'slideRight'}
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
