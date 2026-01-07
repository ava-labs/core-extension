import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Collapse,
  Stack,
  styled,
  useTheme,
} from '@avalabs/k2-alpine';
import { matchPath, Route, Switch, useHistory } from 'react-router-dom';

import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { useAnalyticsContext, useOnboardingContext } from '@core/ui';

// import { CoreSplash } from '@/components/CoreSplash';

import { LanguageSelector } from '@/components/LanguageSelector';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { ImportWallet } from './ImportWallet';
import { ScreenshotsCarousel } from './components/ScreenshotsCarousel';
import { CreateNewWalletFlow } from './flows/CreateNewWallet';
import { SeedlessSignInButton } from './components/SeedlessSignInButton';
import { FeatureGates, SeedlessAuthProvider } from '@core/types';
import { SeedlessFlow } from './flows/SeedlessFlow';
import { CoreSplashStatic } from '@/components/CoreSplashStatic';
import { useFeatureFlagContext } from '@core/ui';

export function Onboarding() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { capture, initAnalyticsIds } = useAnalyticsContext();
  const { resetStates } = useOnboardingContext();
  const { featureFlags } = useFeatureFlagContext();
  const [hasLogoAnimationEnded, setHasLogoAnimationEnded] = useState(false);

  useEffect(() => {
    initAnalyticsIds(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const maybeReset = (e: HashChangeEvent) => {
      const [, hash] = e.newURL.split('#');
      const isHomePage =
        hash &&
        (matchPath(hash, { path: '/onboarding', exact: true }) ||
          matchPath(hash, { path: '/', exact: true }));
      if (isHomePage) {
        resetStates();
      }
    };

    window.addEventListener('hashchange', maybeReset);
    // Reset on mount as well
    resetStates();
    return () => window.removeEventListener('hashchange', maybeReset);
  }, [resetStates]);

  // TODO: Add back the animated logo once the background is fixed
  const ANIMATION_DURATION = 1000;
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLogoAnimationEnded(true);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FullscreenAnimatedBackground />
      <Stack
        direction="row"
        width={1}
        height={1}
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <Box position="fixed" top={28} right={28}>
          {featureFlags[FeatureGates.LANGUAGES] && (
            <LanguageSelector
              dataTestId="onboarding-language-selector"
              onSelectEventName="OnboardingLanguageChanged"
            />
          )}
        </Box>
        <Column>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <CoreSplashStatic style={{ marginTop: theme.spacing(-5) }} />
          </Stack>
          <Collapse in={hasLogoAnimationEnded}>
            <Stack
              marginTop={8.5}
              width={320}
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={4}
            >
              <Stack direction="column" width={1} gap={2}>
                <SeedlessSignInButton
                  provider={SeedlessAuthProvider.Google}
                  startIcon={<FcGoogle />}
                >
                  {t('Continue with Google')}
                </SeedlessSignInButton>
                <SeedlessSignInButton
                  provider={SeedlessAuthProvider.Apple}
                  startIcon={<FaApple />}
                >
                  {t('Continue with Apple')}
                </SeedlessSignInButton>
              </Stack>
              <Stack direction="column" width={1} gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    capture('OnboardingCreateNewWalletSelected');
                    history.push('/onboarding/create');
                  }}
                >
                  {t('Manually create new wallet')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => {
                    capture('OnboardingImportWalletSelected');
                    history.push('/onboarding/import');
                  }}
                >
                  {t('Access existing wallet')}
                </Button>
              </Stack>
            </Stack>
          </Collapse>
        </Column>
        <SlidesColumn>
          <ScreenshotsCarousel />
        </SlidesColumn>

        <Switch>
          <Route path="/onboarding/import">
            <ImportWallet />
          </Route>
          <Route path="/onboarding/create">
            <CreateNewWalletFlow />
          </Route>
          <Route path="/onboarding/seedless">
            <SeedlessFlow />
          </Route>
        </Switch>
      </Stack>
    </>
  );
}

const Column = styled(Stack)`
  width: 50%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SlidesColumn = styled(Column)`
  display: none;
  @media (min-width: 800px) {
    display: flex;
  }
`;
