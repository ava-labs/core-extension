import { cloneElement, useEffect, useState } from 'react';
import { MainPage } from './pages/MainPage';
import { Currencies } from './pages/Currencies';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
import { Feedback } from './pages/Feedback';
import { SettingsPages, useSettingsContext } from '@core/ui';
import {
  Badge,
  Drawer,
  IconButton,
  MenuIcon,
  Stack,
  styled,
} from '@avalabs/core-k2-components';
import { ExportRecoveryPhrase } from './pages/ExportRecoveryPhrase';
import { ExportState, useSeedlessMnemonicExport } from '@core/ui';
import { RecoveryMethods } from './pages/RecoveryMethods/RecoveryMethods';
import { useSeedlessMfaManager } from '@core/ui';
import { Notifications } from './pages/Notifications';

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
  const { state: seedlessExportState } = useSeedlessMnemonicExport();
  const { isMfaSetupPromptVisible } = useSeedlessMfaManager();

  const showSeedlessExportDot =
    seedlessExportState === ExportState.ReadyToExport;

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
      pageElement = (
        <SecurityAndPrivacy
          {...pageProps}
          showNotificationDotOn={
            showSeedlessExportDot ? [SettingsPages.EXPORT_RECOVERY_PHRASE] : []
          }
        />
      );
      break;
    case SettingsPages.CHANGE_PASSWORD:
      pageElement = <ChangePassword {...pageProps} />;
      break;
    case SettingsPages.RECOVERY_PHRASE:
      pageElement = <RecoveryPhrase {...pageProps} />;
      break;
    case SettingsPages.EXPORT_RECOVERY_PHRASE:
      pageElement = <ExportRecoveryPhrase {...pageProps} />;
      break;
    case SettingsPages.RECOVERY_METHODS:
      pageElement = <RecoveryMethods {...pageProps} />;
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
    case SettingsPages.FEEDBACK:
      pageElement = <Feedback {...pageProps} />;
      break;
    case SettingsPages.NOTIFICATIONS:
      pageElement = <Notifications {...pageProps} />;
      break;
    default:
      pageElement = (
        <MainPage
          {...pageProps}
          showNotificationDotOn={
            showSeedlessExportDot ? [SettingsPages.SECURITY_AND_PRIVACY] : []
          }
        />
      );
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
        <Badge
          color="secondary"
          badgeContent="1"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          componentsProps={{
            badge: {
              style: { minWidth: 0, width: 16, height: 16 },
            },
          }}
          invisible={!showSeedlessExportDot && !isMfaSetupPromptVisible}
        >
          <MenuIcon size={24} />
        </Badge>
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
        <Drawer
          open={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            resetNavigation();
          }}
        >
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
        </Drawer>
      </CSSTransition>
    </>
  );
}
