import { Stack } from '@avalabs/k2-alpine';
import { PropsWithChildren } from 'react';
import { CSS_CLASSES, getClassSelector } from './styledComponents';

export const ConciergePromptBackground = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      sx={{
        [`.${CSS_CLASSES.PROMPT_BACKGROUND}`]: {
          display: 'none',
          opacity: 0,
          transition: `opacity 400ms linear`,
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
    </Stack>
  );
};
