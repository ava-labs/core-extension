import { useEffect, useState } from 'react';
import { usePreferredColorScheme } from '@core/ui';
import { Stack, StackProps } from '@avalabs/k2-alpine';

import CoreDarkScreen1 from '@/images/screens/CoreDark_Screen_1.png';
import CoreDarkScreen2 from '@/images/screens/CoreDark_Screen_2.png';
import CoreDarkScreen3 from '@/images/screens/CoreDark_Screen_3.png';
import CoreLightScreen1 from '@/images/screens/CoreLight_Screen_1.png';
import CoreLightScreen2 from '@/images/screens/CoreLight_Screen_2.png';
import CoreLightScreen3 from '@/images/screens/CoreLight_Screen_3.png';

import { PageControl } from '@/components/PageControl';

import * as Styled from './CarouselStyles';

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
  const screens =
    colorScheme === 'light'
      ? DarkThemeScreenshotCollection
      : LightThemeScreenshotCollection;
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screens.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [screens.length]);

  return (
    <Stack gap={2.5} alignItems="center" width="100%" {...props}>
      <Styled.SlidesContainer>
        {screens.map((screen, index, { length }) => {
          const isActive = index === current;
          const isPrevious =
            index + 1 === current || (index === length - 1 && current === 0);

          return (
            <Styled.CarouselSlide
              key={index}
              phase={isActive ? 'active' : isPrevious ? 'previous' : 'next'}
            >
              <img
                src={screen.src}
                alt={screen.alt}
                height="100%"
                width="100%"
              />
            </Styled.CarouselSlide>
          );
        })}
      </Styled.SlidesContainer>
      <PageControl current={current} total={screens.length} />
    </Stack>
  );
};
