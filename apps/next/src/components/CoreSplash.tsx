// import { Stack } from '@avalabs/k2-alpine';
import { usePreferredColorScheme } from '@core/ui';

import CoreSplashDark from '@/images/splash/core-splash-anim-dark.gif';
import CoreSplashLight from '@/images/splash/core-splash-anim-light.gif';
import { useCallback, useEffect, useRef } from 'react';

type Props = {
  onGifEnd: () => void;
};

const GIF_DURATION = 1230;

export const CoreSplash = ({ onGifEnd }: Props) => {
  const scheme = usePreferredColorScheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onLoad = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(onGifEnd, GIF_DURATION);
  }, [onGifEnd]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const props = {
    width: 180,
    height: 60,
    alt: 'Core Logo',
    onLoad,
  } as const;

  console.log('scheme', scheme);

  if (scheme === 'light') {
    return <img src={CoreSplashLight} {...props} />;
  }

  return <img src={CoreSplashDark} {...props} />;
};
