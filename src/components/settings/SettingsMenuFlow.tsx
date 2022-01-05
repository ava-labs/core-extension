import React, { useState } from 'react';
import { VerticalFlex } from '@avalabs/react-components';
import styled from 'styled-components';
import { MainPage } from './pages/MainPage';
import { Currencies } from './pages/Currencies';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SettingsPages } from './models';
import { SecurityAndPrivacy } from './pages/SecurityAndPrivacy';
import { ChangePassword } from './pages/ChangePassword';
import { RecoveryPhrase } from './pages/RecoveryPhrase';
import {
  ContextContainer,
  useIsSpecificContextContainer,
} from '@src/hooks/useIsSpecificContextContainer';
import { SettingsMenuMiniMode } from './SettingsMenu.minimode';
import { SettingsMenu } from './SettingsMenu';
import { Network } from './pages/Network';
import { EditContact } from './pages/EditContact';
import { AddContact } from './pages/AddContact';
import { ContactList } from './pages/ContactList';
import { Advanced } from './pages/Advanced';

const AnimatedContainer = styled(VerticalFlex)`
  height: 100%;
  max-height: 100%;
  width: fit-content;
  position: absolute;
  top: 0;

  &.slideNext-enter {
    z-index: 2;
    transform: translateX(100%);
  }
  &.slideNext-enter-active {
    z-index: 2;
    transform: translateX(0%);
    transition: transform 300ms ease-in-out;
  }
  &.slideNext-exit {
    z-index: 1;
    transform: translateX(0%);
  }
  &.slideNext-exit-active {
    z-index: 1;
    transform: translateX(-100%);
    transition: transform 300ms ease-in-out;
  }

  &.slideBack-enter {
    transform: translateX(-100%);
  }
  &.slideBack-enter-active {
    transform: translateX(0%);
  }
  &.slideBack-exit {
    transform: translateX(0%);
  }
  &.slideBack-exit-active {
    transform: translateX(100%);
  }
  &.slideBack-enter-active,
  &.slideBack-exit-active {
    transition: transform 300ms;
  }
`;

export interface SettingsMenuProps {
  currentPage: SettingsPages;
  onClose: () => void;
}

const dynamicChildFactory = (classNames) => (child) =>
  React.cloneElement(child, {
    classNames,
  });

export function SettingsMenuFlow() {
  const isMiniMode = useIsSpecificContextContainer(ContextContainer.POPUP);
  const [navStack, setNavStack] = useState<SettingsPages[]>([
    SettingsPages.MAIN_PAGE,
  ]);
  const [isBackAnimation, setIsBackAnimation] = useState(false);
  const currentPage = navStack[navStack.length - 1];

  const goBack = () => {
    if (navStack.length === 1) {
      return;
    }
    setIsBackAnimation(true);
    const newStack = navStack.slice(0, -1) || [];
    setNavStack([...newStack]);
  };

  const navigateTo = (page: SettingsPages) => {
    setNavStack([...navStack, page]);
  };

  const resetNavigation = () => {
    setNavStack([SettingsPages.MAIN_PAGE]);
  };

  let pageElement: JSX.Element | null = null;

  const pageProps = {
    navigateTo,
    goBack,
    width: isMiniMode ? '319px' : '375px',
  };

  switch (currentPage) {
    case SettingsPages.CURRENCIES:
      pageElement = <Currencies {...pageProps} />;
      break;
    case SettingsPages.CONTACT_LIST:
      pageElement = <ContactList {...pageProps} />;
      break;
    case SettingsPages.ADD_CONTACT:
      pageElement = <AddContact {...pageProps} />;
      break;
    case SettingsPages.EDIT_CONTACT:
      pageElement = <EditContact {...pageProps} />;
      break;
    case SettingsPages.SECURITY_AND_PRIVACY:
      pageElement = <SecurityAndPrivacy {...pageProps} />;
      break;
    case SettingsPages.CHANGE_PASSWORD:
      pageElement = <ChangePassword {...pageProps} />;
      break;
    case SettingsPages.RECOVERY_PHRASE:
      pageElement = <RecoveryPhrase {...pageProps} />;
      break;
    case SettingsPages.NETWORK:
      pageElement = <Network {...pageProps} />;
      break;
    case SettingsPages.ADVANCED:
      pageElement = <Advanced {...pageProps} />;
      break;
    default:
      pageElement = <MainPage {...pageProps} />;
  }

  const SettingsElement = isMiniMode ? SettingsMenuMiniMode : SettingsMenu;
  const animationClass = isBackAnimation ? 'slideBack' : 'slideNext';

  return (
    <SettingsElement currentPage={currentPage} onClose={resetNavigation}>
      <TransitionGroup childFactory={dynamicChildFactory(animationClass)}>
        <CSSTransition
          in={true}
          key={currentPage}
          addEndListener={(node, done) => {
            node.addEventListener('transitionend', done, false);
            setIsBackAnimation(false);
          }}
          classNames={animationClass}
        >
          <AnimatedContainer
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {pageElement}
          </AnimatedContainer>
        </CSSTransition>
      </TransitionGroup>
    </SettingsElement>
  );
}
