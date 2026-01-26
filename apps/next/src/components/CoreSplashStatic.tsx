import CoreSplashStaticDark from '@/images/core.svg';
import CoreSplashStaticLight from '@/images/core-light.svg';
import { usePreferredColorScheme } from '@core/ui';
import { HTMLAttributes } from 'react';

const imgSrc: Record<
  ReturnType<typeof usePreferredColorScheme>,
  Record<string, string>
> = {
  light: {
    default: CoreSplashStaticDark,
  },
  dark: {
    default: CoreSplashStaticLight,
  },
  testnet: {
    default: CoreSplashStaticLight,
  },
};

export const CoreSplashStatic = (
  props: HTMLAttributes<HTMLImageElement> & { width?: string; height?: string },
) => {
  const scheme = usePreferredColorScheme();
  const { width = '150px', height = '40px', ...rest } = props;
  return (
    <img
      {...rest}
      src={imgSrc[scheme]['default']}
      alt="Core Logo"
      width={width}
      height={height}
      data-testid="core-logo"
    />
  );
};
