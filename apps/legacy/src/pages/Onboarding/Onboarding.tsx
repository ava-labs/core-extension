import { AppBackground } from '@/components/common/AppBackground';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { useAnalyticsContext } from '@core/ui';
import { useOnboardingContext } from '@core/ui';
import {
  Box,
  CircularProgress,
  HomeIcon,
  Stack,
  styled,
} from '@avalabs/core-k2-components';
import { OnboardingPhase, OnboardingURLs } from '@core/types';
import { Suspense, useEffect, useState } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { LanguageSelector } from './components/LanguageSelector';
import { AnalyticsConsent } from './pages/AnalyticsConsent';
import { CreatePassword } from './pages/CreatePassword';
import { CreateWallet } from './pages/CreateWallet/CreateWallet';
import { ImportWallet } from './pages/ImportWallet';
import { Keystone } from './pages/Keystone/Keystone';
import { LedgerConnect } from './pages/Ledger/LedgerConnect';
import { LedgerTrouble } from './pages/Ledger/LedgerTrouble';
import { RecoveryMethods } from './pages/Seedless/RecoveryMethods';
import { RecoveryMethodsLogin } from './pages/Seedless/RecoveryMethodsLogin';
import { VerifyGoBackModal } from './pages/Seedless/modals/VerifyGoBackModal';
import { Welcome } from './pages/Welcome/Welcome';

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

export function Onboarding() {
  const history = useHistory();
  const location = useLocation();
  const { submitInProgress, setOnboardingPhase, onboardingPhase } =
    useOnboardingContext();
  const { initAnalyticsIds, capture } = useAnalyticsContext();
  const [isVerifyGoBackModalOpen, setIsVerifyGoBackModalOpen] = useState(false);

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
              <Route path={OnboardingURLs.RECOVERY_METHODS}>
                <Suspense fallback={<CircularProgress />}>
                  <RecoveryMethods />
                </Suspense>
              </Route>
              <Route path={OnboardingURLs.RECOVERY_METHODS_LOGIN}>
                <Suspense fallback={<CircularProgress />}>
                  <RecoveryMethodsLogin />
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
                  if (onboardingPhase === OnboardingPhase.SEEDLESS_GOOGLE) {
                    setIsVerifyGoBackModalOpen(true);
                    return;
                  }
                  setOnboardingPhase(null);
                  history.push(OnboardingURLs.ONBOARDING_HOME);
                }}
              />
            </Stack>
          )}
          <VerifyGoBackModal
            isOpen={isVerifyGoBackModalOpen}
            onBack={() => {
              history.push(OnboardingURLs.ONBOARDING_HOME);
              setIsVerifyGoBackModalOpen(false);
            }}
            onCancel={() => {
              setIsVerifyGoBackModalOpen(false);
            }}
          />
        </OnboardingStep>
      </ContentPart>
      <ContentPart
        sx={{
          backgroundColor: 'background.paper',
          height: '100%',
          backdropFilter: 'blur(15px)',
        }}
      >
        <AppBackground />
      </ContentPart>
    </Box>
  );
}
