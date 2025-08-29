import AvaDark from '@/images/on-ramp-gradients/ava.dark.svg';
import AvaLight from '@/images/on-ramp-gradients/ava.light.svg';
import { styled, Theme } from '@avalabs/k2-alpine';
import { CSSProperties, useState } from 'react';

const isLightTheme = (theme: Theme) => theme.palette.mode === 'light';

const Image = styled('div')(({ theme }) => ({
  '--spot-size': '40px',
  '--spot-color': isLightTheme(theme)
    ? theme.palette.common.white_30
    : theme.palette.common.black,

  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${isLightTheme(theme) ? AvaLight : AvaDark})`,
  backgroundSize: 'auto',
  backgroundPosition: 'bottom right',
  backgroundRepeat: 'no-repeat',
  isolation: 'isolate',

  '&::before': {
    content: '""',
    opacity: 0,
    background: 'inherit',
    position: 'absolute',
    inset: 0,
    mask: `radial-gradient(circle var(--spot-size) at var(--x) var(--y), var(--spot-color) 0%, var(--spot-color) 30%, transparent 100%)`,
    mixBlendMode: isLightTheme(theme) ? 'difference' : 'plus-lighter',
    transition: theme.transitions.create(['opacity'], {
      duration: 2000,
    }),
  },

  '&:hover::before': {
    opacity: 1,
    transitionDuration: `${theme.transitions.duration.short}ms`,
  },

  '&:after': {
    content: '""',
    position: 'absolute',
    inset: theme.spacing(-1.5),
  },
}));

export const AvaGradient = () => {
  const [x, setX] = useState<string>('85px');
  const [y, setY] = useState<string>('75px');

  return (
    <Image
      style={{ '--x': x, '--y': y } as CSSProperties}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;
        setX(`${relativeX}px`);
        setY(`${relativeY}px`);
      }}
    />
  );
};
