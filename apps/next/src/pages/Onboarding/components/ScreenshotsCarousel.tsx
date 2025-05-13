import { useEffect, useMemo, useState } from 'react';
import { usePreferredColorScheme } from '@core/ui';
import { Box, Stack, StackProps, styled } from '@avalabs/k2-alpine';

import CoreDarkScreen1 from '@/images/screens/CoreDark_Screen_1.png';
import CoreDarkScreen2 from '@/images/screens/CoreDark_Screen_2.png';
import CoreDarkScreen3 from '@/images/screens/CoreDark_Screen_3.png';
import CoreLightScreen1 from '@/images/screens/CoreLight_Screen_1.png';
import CoreLightScreen2 from '@/images/screens/CoreLight_Screen_2.png';
import CoreLightScreen3 from '@/images/screens/CoreLight_Screen_3.png';

import { PageControl } from '@/components/PageControl';

const DarkThemeScreenshotCollection = [
  { src: CoreDarkScreen1, alt: 'Core - Portfolio screen' },
  { src: CoreDarkScreen2, alt: 'Core - Receive screen' },
  { src: CoreDarkScreen3, alt: 'Core - NFTs screen' },
];

const LightThemeScreenshotCollection = [
  { src: CoreLightScreen1, alt: 'Core - Portfolio screen' },
  { src: CoreLightScreen2, alt: 'Core - Receive screen' },
  { src: CoreLightScreen3, alt: 'Core - NFTs screen' },
];

export const ScreenshotsCarousel = (props: StackProps) => {
  const colorScheme = usePreferredColorScheme();
  const screens = useMemo(
    () =>
      colorScheme === 'light'
        ? DarkThemeScreenshotCollection
        : LightThemeScreenshotCollection,
    [colorScheme],
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === screens.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [screens.length]);

  const slides = useMemo(
    () =>
      screens.map((screen, index, { length }) => {
        const isActive = index === current;
        const isPrevious =
          index + 1 === current || (index === length - 1 && current === 0);
        return (
          <Slide
            key={index}
            phase={isActive ? 'active' : isPrevious ? 'previous' : 'next'}
          >
            <img src={screen.src} alt={screen.alt} height="100%" width="100%" />
          </Slide>
        );
      }),
    [screens, current],
  );

  return (
    <Stack gap={2.5} alignItems="center" width="100%" {...props}>
      <SlidesContainer>{slides}</SlidesContainer>
      <PageControl current={current} total={screens.length} />
    </Stack>
  );
};

const SlidesContainer = styled(Stack)`
  flex-direction: row;
  transition: width 0.2s ease-in-out;
  align-items: center;
  position: relative;
  aspect-ratio: 640 / 1200; // Based on size of screenshot assets

  @media (min-width: 800px) {
    display: flex;
    width: 50%;
  }

  @media (min-width: 1200px) {
    width: min(40%, 300px);
  }
`;

type SlidePhase = 'active' | 'next' | 'previous';
type SlideProps = {
  phase: SlidePhase;
};

const Slide = styled(Box, {
  shouldForwardProp: (p) => p !== 'src' && p !== 'active',
})<SlideProps>(({ phase }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  transitionProperty: 'transform, box-shadow, z-index',
  transitionDuration: '0.4s, 0.4s, 0.4s',
  transitionDelay: '0ms, 0ms, 0.2s',
  borderRadius: 15,
  ...getStyleForPhase(phase),
}));

const getStyleForPhase = (phase: SlidePhase) => {
  switch (phase) {
    case 'active':
      return {
        zIndex: 2,
        boxShadow: `0px 0px 20px 10px rgba(0, 0, 0, 0.4)`,
        transform: `scale(1) translateX(0) translateY(-10px)`,
        transitionDelay: '0ms',
      };
    case 'next':
      return {
        zIndex: 1,
        boxShadow: `0px 0px 0 0px rgba(0, 0, 0, 0.0)`,
        transform: `scale(0.95) translateX(50%) translateY(-10px)`,
        '@media(min-width: 1200px)': {
          transform: `scale(0.95) translateX(80%) translateY(-10px)`,
        },
      };
    case 'previous':
      return {
        zIndex: 0,
        boxShadow: `0px 0px 0 0px rgba(0, 0, 0, 0.0)`,
        transform: `scale(0.95) translateX(-50%) translateY(-10px)`,
        '@media(min-width: 1200px)': {
          transform: `scale(0.95) translateX(-80%) translateY(-10px)`,
        },
      };
  }
};
