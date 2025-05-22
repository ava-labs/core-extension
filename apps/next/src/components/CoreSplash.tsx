import { HTMLAttributes, useEffect, useRef } from 'react';
import { usePreferredColorScheme } from '@core/ui';

import CoreSplashDark from '@/images/splash/core-splash-anim-dark.gif';
import CoreSplashLight from '@/images/splash/core-splash-anim-light.gif';

import CoreSplashDarkBig from '@/images/splash/core-splash-anim-dark-2x.gif';
import CoreSplashLightBig from '@/images/splash/core-splash-anim-light-2x.gif';

type Props = HTMLAttributes<HTMLImageElement> & {
  size?: 'default' | 'big';
  onGifEnd?: () => void;
};

const GIF_DURATION = 1230;

export const CoreSplash = ({ onGifEnd, size = 'default', ...rest }: Props) => {
  const scheme = usePreferredColorScheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const props = {
    width: size === 'big' ? 360 : 180,
    height: size === 'big' ? 120 : 60,
    alt: 'Core Logo',
    onLoad: onGifEnd
      ? () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(onGifEnd, GIF_DURATION);
        }
      : undefined,
  } as const;

  if (scheme === 'light') {
    return (
      <img
        src={size === 'big' ? CoreSplashLightBig : CoreSplashLight}
        {...rest}
        {...props}
      />
    );
  }

  return (
    <img
      src={size === 'big' ? CoreSplashDarkBig : CoreSplashDark}
      {...rest}
      {...props}
    />
  );
};
