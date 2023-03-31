import { cloneElement, useEffect, useState } from 'react';
import { SecondaryOverlay } from '@avalabs/react-components';
import styled from 'styled-components';
import { MainPage } from './pages/MainPage';
import { Currencies } from './pages/Currencies';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { SettingsPages } from './models';
import { SecurityAndPrivacy } from './pages/SecurityAndPrivacy';
import { ChangePassword } from './pages/ChangePassword';
import { RecoveryPhrase } from './pages/RecoveryPhrase';
import { AddContact } from './pages/AddContact';
import { ContactList } from './pages/ContactList';
import { ContactProfile } from './components/ContactProfile';
import { ConnectedSites } from './pages/ConnectedSites';
import { Ledger } from './pages/Ledger';
import { Legal } from './pages/Legal';
import { Advanced } from './pages/Advanced';
import { Language } from './pages/Language';
import { useSettingsContext } from '@src/contexts/SettingsProvider';
import { IconButton, MenuIcon, Stack } from '@avalabs/k2-components';

const OuterContainer = styled(SecondaryOverlay)`
  flex-direction: column;
  align-items: flex-start;

  &.slideIn-enter {
    transform: translateX(-100%);
  }
  &.slideIn-enter-active {
    transform: translateX(0%);
    transition: transform 300ms;
  }
  &.slideIn-exit {
    transform: translateX(0%);
  }
  &.slideIn-exit-active {
    transform: translateX(-100%);
    transition: transform 300ms;
  }
`;

const AnimatedContainer = styled(Stack)`
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
  cloneElement(child, {
    classNames,
  });

export function SettingsMenu() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settingsActivePage,
    setSettingsActivePage,
  } = useSettingsContext();
  const [navStack, setNavStack] = useState<SettingsPages[]>([
    settingsActivePage,
  ]);
  const [isBackAnimation, setIsBackAnimation] = useState<boolean>(false);

  useEffect(() => {
    setNavStack([settingsActivePage]);
  }, [settingsActivePage]);

  const currentPage = navStack[navStack.length - 1];

  const goBack = () => {
    if (navStack.length === 1) {
      setIsSettingsOpen(false);
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
    setSettingsActivePage(SettingsPages.MAIN_PAGE);
  };

  let pageElement: JSX.Element | null = null;

  const pageProps = {
    navigateTo,
    goBack,
    width: '319px',
    onClose: () => {
      setIsSettingsOpen(false);
      resetNavigation();
    },
  };

  switch (currentPage) {
    case SettingsPages.CURRENCIES:
      pageElement = <Currencies {...pageProps} />;
      break;
    case SettingsPages.CONTACT_LIST:
      pageElement = <ContactList {...pageProps} />;
      break;
    case SettingsPages.CONTACT_PROFILE:
      pageElement = <ContactProfile {...pageProps} />;
      break;
    case SettingsPages.ADD_CONTACT:
      pageElement = <AddContact {...pageProps} />;
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
    case SettingsPages.CONNECTED_SITES:
      pageElement = <ConnectedSites {...pageProps} />;
      break;
    case SettingsPages.LEDGER:
      pageElement = <Ledger {...pageProps} />;
      break;
    case SettingsPages.LEGAL:
      pageElement = <Legal {...pageProps} />;
      break;
    case SettingsPages.ADVANCED:
      pageElement = <Advanced {...pageProps} />;
      break;
    case SettingsPages.LANGUAGE:
      pageElement = <Language {...pageProps} />;
      break;
    default:
      pageElement = <MainPage {...pageProps} />;
  }

  const animationClass = isBackAnimation ? 'slideBack' : 'slideNext';

  return (
    <>
      <IconButton
        data-testid="hamburger-menu-button"
        onClick={() => setIsSettingsOpen(true)}
        sx={{
          p: 0,
        }}
      >
        <MenuIcon size={24} />
      </IconButton>
      <CSSTransition
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
        onExited={() => {
          // only reset navigation once the drawer is closed
          resetNavigation();
        }}
        in={isSettingsOpen}
        classNames="slideIn"
        unmountOnExit
      >
        <OuterContainer onClick={() => setIsSettingsOpen(false)}>
          <Stack
            sx={{
              width: '319px',
              overflow: 'hidden',
              height: '100%',
              position: 'relative',
              backgroundColor: 'background.paper',
            }}
          >
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
          </Stack>
        </OuterContainer>
      </CSSTransition>
    </>
  );
}
