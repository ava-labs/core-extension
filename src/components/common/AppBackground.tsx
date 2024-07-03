import { Stack, styled } from '@avalabs/k2-components';
import { Suspense } from 'react';

const FallbackImage = styled(Stack)`
  height: 100%;
  min-height: 100%;
  min-width: 50vw;
  width: 50vw;
  background: url('/images/onboarding-background.png') no-repeat center/cover;
`;

const VideoBackground = styled('video')`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
`;

export function AppBackground() {
  const QUERY = '(prefers-reduced-motion: reduce)';
  const mediaQueryList = window.matchMedia(QUERY);
  const prefersReducedMotion = mediaQueryList.matches;

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {prefersReducedMotion ? (
        <FallbackImage />
      ) : (
        <Suspense fallback={<FallbackImage />}>
          <VideoBackground autoPlay loop muted>
            <source src="/images/core-ext-hero-hq.webm" type="video/webm" />
          </VideoBackground>
        </Suspense>
      )}
    </Stack>
  );
}
