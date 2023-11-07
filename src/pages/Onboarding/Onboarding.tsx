import {
  styled,
  Stack,
  CircularProgress,
  HomeIcon,
  Box,
} from '@avalabs/k2-components';
import { LanguageSelector } from './components/LanguageSelector';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { Welcome } from './pages/Welcome';
import { CreateWallet } from './pages/CreateWallet/CreateWallet';
import { OnboardingURLs } from '@src/background/services/onboarding/models';
import { Keystone } from './pages/Keystone/Keystone';
import { LedgerConnect } from './pages/Ledger/LedgerConnect';
import { ImportWallet } from './pages/ImportWallet';
import { CreatePassword } from './pages/CreatePassword';
import { AnalyticsConsent } from './pages/AnalyticsConsent';
import { useOnboardingContext } from '@src/contexts/OnboardingProvider';
import { LoadingOverlay } from '@src/components/common/LoadingOverlay';
import { LedgerTrouble } from './pages/Ledger/LedgerTrouble';
import { useAnalyticsContext } from '@src/contexts/AnalyticsProvider';

const ContentPart = styled(Stack)`
  flex-grow: 1;
  height: 100%;
  width: 100%;
  background-color: black;
`;

const OnboardingStep = styled(Stack)`
  align-items: center;
  flex: 1;
`;

const AppBackground = styled(Stack)`
  height: 100%;
  background: url('/images/onboarding-background.png') no-repeat center/cover;
`;

export function Onboarding() {
  const history = useHistory();
  const location = useLocation();
  const { submitInProgress, setOnboardingPhase, onboardingPhase } =
    useOnboardingContext();
  const { initAnalyticsIds, capture } = useAnalyticsContext();

  useEffect(() => {
    initAnalyticsIds(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{ display: 'grid', height: '100%', gridTemplateColumns: '1fr 1fr' }}
    >
      {submitInProgress && <LoadingOverlay />}
      <ContentPart sx={{ px: 2 }}>
        <Stack sx={{ alignItems: 'end', py: 2 }}>
          <LanguageSelector />
        </Stack>
        <OnboardingStep sx={{ justifyContent: 'space-between' }}>
          <Stack
            sx={{
              height: '100%',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Switch>
              <Route path={OnboardingURLs.ANALYTICS_CONSENT}>
                <Suspense fallback={<CircularProgress />}>
                  <AnalyticsConsent />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.CREATE_PASSWORD}>
                <Suspense fallback={<CircularProgress />}>
                  <CreatePassword />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.SEED_PHRASE}>
                <Suspense fallback={<CircularProgress />}>
                  <ImportWallet />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.KEYSTONE}>
                <Suspense fallback={<CircularProgress />}>
                  <Keystone />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.LEDGER}>
                <Suspense fallback={<CircularProgress />}>
                  <LedgerConnect />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.LEDGER_TROUBLE}>
                <Suspense fallback={<CircularProgress />}>
                  <LedgerTrouble />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.CREATE_WALLET}>
                <Suspense fallback={<CircularProgress />}>
                  <CreateWallet />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.ONBOARDING_HOME}>
                <Suspense fallback={<CircularProgress />}>
                  <Welcome />
                </Suspense>
              </Route>
              <Route path="/">
                <Suspense fallback={<CircularProgress />}>
                  <Redirect to="/onboarding" />
                </Suspense>
              </Route>
            </Switch>
          </Stack>
          {location.pathname !== OnboardingURLs.ONBOARDING_HOME && (
            <Stack sx={{ width: '100%', pl: 1, pb: 2 }}>
              <HomeIcon
                size={20}
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  capture('OnboardingCancelled', { step: onboardingPhase });
                  setOnboardingPhase(null);
                  history.push(OnboardingURLs.ONBOARDING_HOME);
                }}
              />
            </Stack>
          )}
        </OnboardingStep>
      </ContentPart>
      <ContentPart sx={{ backgroundColor: 'background.paper' }}>
        <AppBackground />
      </ContentPart>
    </Box>
  );
}
