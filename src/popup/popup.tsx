import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { GlobalStyle } from '@src/styles/styles';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '@src/styles/theme';

import { useStore } from '@src/store/store';
import { Welcome } from '@src/pages/Onboarding/Welcome';
import { Import } from '@src/pages/Onboarding/ImportWallet';
// import { CreateWalletFlow } from '@src/pages/Onboarding/CreateWalletFlow';
import { WalletHome } from '@src/pages/Wallet/WalletHome';
import { Deposit } from '@src/pages/Deposit';

import { Header } from '@src/components/common/Header';
import { Footer } from '@src/components/common/Footer';

import {
  HorizontalFlex,
  LoadingIcon,
  VerticalFlex,
} from '@avalabs/react-components';

const CreateWalletFlow = React.lazy(() => {
  return import('../pages/Onboarding/CreateWalletFlow');
});

const WalletOverview = React.lazy(() => {
  return import('../pages/Wallet/WalletOverview');
});

const AddToken = React.lazy(() => {
  return import('../pages/AddToken/AddToken');
});

const SignMessage = React.lazy(() => {
  return import('../pages/SignMessage/SignMessage');
});

const Send = React.lazy(() => {
  return import('../pages/Send/Send');
});

const PermissionsPage = React.lazy(() => {
  return import('../pages/Permissions/Permissions');
});

const SignTransactionPage = React.lazy(() => {
  return import('../pages/SignTransaction/SignTransactionPage');
});

import { WalletContextProvider } from '@src/contexts/WalletProvider';
import { NetworkContextProvider } from '@src/contexts/NetworkProvider';
import { onboardingService } from '@src/background/services';

export const Popup = observer(() => {
  const { themeStore } = useStore();
  const theme = themeStore.isDarkMode ? darkTheme : lightTheme;
  const [onboardingState, setOnboardingState] =
    useState<{ isInProgress: boolean; isOnboarded: boolean }>();

  useEffect(() => {
    Promise.all([
      onboardingService.onboardIsInProgress(),
      onboardingService.onboarding
        .promisify()
        .then((onboarding) => onboarding.isOnBoarded),
    ]).then(([isInProgress, isOnboarded]) => {
      setOnboardingState({ isInProgress, isOnboarded });
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NetworkContextProvider>
        <WalletContextProvider>
          <VerticalFlex
            height={'100%'}
            style={{
              minHeight: '500px',
              minWidth: '500px',
              backgroundColor: theme.colors.bg,
            }}
          >
            <Header />
            <HorizontalFlex flex={1} justify={'center'}>
              <Switch>
                <Route path="/welcome/create">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <CreateWalletFlow />
                  </React.Suspense>
                </Route>

                <Route path="/welcome">
                  <Welcome />
                </Route>

                <Route path="/import">
                  <Import />
                </Route>

                <Route path="/token/add">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <AddToken />
                  </React.Suspense>
                </Route>

                <Route path="/wallet/overview">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <WalletOverview />
                  </React.Suspense>
                </Route>

                <Route path="/wallet">
                  <WalletHome />
                </Route>

                <Route path="/deposit">
                  <Deposit />
                </Route>

                <Route path="/sign/transaction">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <SignTransactionPage />
                  </React.Suspense>
                </Route>

                <Route path="/send">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <Send />
                  </React.Suspense>
                </Route>

                <Route path="/sign">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <SignMessage />
                  </React.Suspense>
                </Route>

                <Route path="/permissions">
                  <React.Suspense fallback={<LoadingIcon />}>
                    <PermissionsPage />
                  </React.Suspense>
                </Route>

                <Route path="/">
                  <>
                    {
                      {
                        loading: <LoadingIcon />,
                        inProgess: <Redirect to="/welcome/create" />,
                        onboarded: <Redirect to="/welcome" />,
                        wallet: <Redirect to="/wallet" />,
                      }[
                        (function () {
                          if (!onboardingState) {
                            return 'loading';
                          }

                          if (onboardingState.isInProgress) {
                            return 'inProgress';
                          }

                          if (!onboardingState.isOnboarded) {
                            return 'onboarded';
                          }

                          return 'wallet';
                        })()
                      ]
                    }
                  </>
                </Route>
              </Switch>
            </HorizontalFlex>
            <GlobalStyle />
            <Footer />
          </VerticalFlex>
        </WalletContextProvider>
      </NetworkContextProvider>
    </ThemeProvider>
  );
});

export default Popup;
