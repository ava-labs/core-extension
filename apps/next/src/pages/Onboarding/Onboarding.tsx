import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Collapse,
  Stack,
  styled,
  useTheme,
} from '@avalabs/k2-alpine';

// FIXME: import from @avalabs/k2-alpine
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { CoreSplash } from '@/components/CoreSplash';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FullscreenAnimatedBackground } from '@/components/FullscreenAnimatedBackground';

import { ScreenshotsCarousel } from './components/ScreenshotsCarousel';

export function Onboarding() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [hasLogoAnimationEnded, setHasLogoAnimationEnded] = useState(false);

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
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<FcGoogle />}
                >
                  {t('Continue with Google')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<FaApple />}
                >
                  {t('Continue with Apple')}
                </Button>
              </Stack>
              <Stack direction="column" width={1} gap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  {t('Manually create new wallet')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
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
