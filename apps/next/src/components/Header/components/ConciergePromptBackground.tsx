import { Stack, useTheme } from '@avalabs/k2-alpine';
import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { CSS_CLASSES, getClassSelector } from './styledComponents';
import { HEADER_HEIGHT } from '@/config/constants';

export const ConciergePromptBackground = ({ children }: PropsWithChildren) => {
  const theme = useTheme();

  return createPortal(
    <Stack
      sx={{
        position: 'fixed',
        top: `${HEADER_HEIGHT}px`,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: theme.zIndex.appBar + 6,
        pointerEvents: 'none',
        [`.${CSS_CLASSES.PROMPT_BACKGROUND}`]: {
          display: 'none',
          opacity: 0,
          transition: `opacity 200ms linear`,
        },
        [`.${getClassSelector('OVERLAY', 'enter', 'PROMPT_BACKGROUND')}`]: {
          display: 'block',
        },
        [`.${getClassSelector('OVERLAY', 'enter-done', 'PROMPT_BACKGROUND')}`]:
          {
            display: 'block',
            opacity: 1,
          },
        [`.${getClassSelector('OVERLAY', 'exit', 'PROMPT_BACKGROUND')}`]: {
          display: 'block',
          opacity: 1,
        },
        [`.${getClassSelector('OVERLAY', 'exit-done', 'PROMPT_BACKGROUND')}`]: {
          display: 'block',
          opacity: 0,
        },
      }}
    >
      {children}
    </Stack>,
    document.body,
  );
};
