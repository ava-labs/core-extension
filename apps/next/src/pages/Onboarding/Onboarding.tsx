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
import { Route, Switch, useHistory } from 'react-router-dom';

import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { useAnalyticsContext } from '@core/ui';

import { CoreSplash } from '@/components/CoreSplash';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { ImportWallet } from './ImportWallet';
import { ScreenshotsCarousel } from './components/ScreenshotsCarousel';
import { CreateNewWalletFlow } from './flows/CreateNewWallet';
import { SeedlessSignInButton } from './components/SeedlessSignInButton';
import { SeedlessAuthProvider } from '@core/types';
import { SeedlessFlow } from './flows/SeedlessFlow';

export function Onboarding() {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const { capture, initAnalyticsIds } = useAnalyticsContext();

  const [hasLogoAnimationEnded, setHasLogoAnimationEnded] = useState(false);

  useEffect(() => {
    initAnalyticsIds(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Box position="fixed" top={32} right={32}>
          <LanguageSelector />
        </Box>
        <Column>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <CoreSplash
              size="big"
              onGifEnd={() => setHasLogoAnimationEnded(true)}
              style={{ marginTop: theme.spacing(-5), transform: 'scale(0.75)' }}
            />
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
