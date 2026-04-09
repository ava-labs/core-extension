import {
  Button,
  keyframes,
  Stack,
  styled,
  Typography,
} from '@avalabs/k2-alpine';

export const AccountInfo = styled(Stack)`
  cursor: pointer;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  transition: ${({ theme }) =>
    theme.transitions.create(['background', 'opacity'])};
  flex-direction: row;
  align-items: center;
  min-width: 0;
  & > svg {
    opacity: 0;
  }
`;

export const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
  position: relative;
  flex: 0 1 auto;
  min-width: 0;
  overflow: visible;
`;

export const promptTextAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(25%, 0px, 0px);
  }
  20% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
  80% {
    opacity: 1;
    transform: translate3d(0px, 0px, 0px);
  }
  100% {
    opacity: 0;
    transform: translate3d(25%, 0px, 0px);
  }
`;
export const TextAnimation = styled('span')`
  animation: 4000ms ease 0s infinite normal none running ${promptTextAnimation};
`;

const promptBackgroundAnimation = keyframes`
  to {
	  --angle: 360deg;
	}
`;

export const AnimatedButton = styled(Button)(({ theme }) => ({
  width: '90px',
  height: '3px',
  top: '4px',
  left: '50%',
  padding: 0,
  transform: 'translateX(-50%)',
  transition: `width 250ms linear,
			top 250ms linear,
			left 250ms linear,
      opacity 250ms ease-in-out,
      height 250ms ease-in-out,
      transform 300ms ease-in-out`,
  zIndex: theme.zIndex.appBar + 1,
  span: {
    display: 'none',
    opacity: '0',
    transition: `opacity 200ms linear, transform 250ms ease-in-out`,
    transform: 'scale(0)',
    h6: {
      transition: `opacity 250ms linear, transform 250ms ease-in-out`,
      opacity: '0',
      transform: 'scale(0)',
    },
  },

  // This adds an invisible clickable area above the button such that the button
  // can be clicked even when the cursor is still in the place where the little bar was rendered.
  '&::before': {
    content: "''",
    height: 16,
    width: '100%',
    position: 'absolute',
    top: '-16px',
    left: '0',
  },
  [`&.${getClassSelector('BUTTON', 'enter')}`]: {
    span: {
      display: 'inline',
    },
  },
  [`&.${getClassSelector('BUTTON', 'enter-done')}`]: {
    height: '42px',
    width: '100%',
    top: '13px',
    span: {
      opacity: '1',
      display: 'inline',
      transform: 'scale(1)',
      h6: {
        opacity: '1',
        transform: 'scale(1)',
      },
    },
  },
}));

export const PromptButtonBackground = styled(Stack)`
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  position: absolute;
  top: -50px;
  left: -20px;
  width: 360px;
  height: 300px;
  pointer-events: none;
  background-image: conic-gradient(
    from var(--angle) at 50% 50%,
    rgba(255, 9, 127, 0) 1.75deg,
    rgba(176, 255, 24, 0) 122.63deg,
    #a1ff68 131.64deg,
    #26f2ff 180deg,
    #7748ff 270deg,
    rgba(255, 4, 140, 0.75) 344.3deg
  );
  background-size: 250px 220px;
  background-repeat: no-repeat;
  background-position: center top;
  filter: blur(75px);
  animation: ${promptBackgroundAnimation} 10s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const CSS_CLASSES = {
  OVERLAY: 'overlay',
  PROMPT_BACKGROUND: 'prompt-background',
  BACKDROP: 'backdrop',
  BUTTON: 'button',
} as const;

export type CSS_STATES = 'enter' | 'enter-done' | 'exit' | 'exit-done';

/**
 * Builds CSS classes for CSSTransition components
 * @param className - The CSS class constant key - main component
 * @param state - The transition state - where the transition is happening
 * @param backgroundClass - Optional additional class to select a custom component (e.g. background)
 * @returns The complete CSS class selector string which can be applied as CSSTransition wants it
 */
export const getClassSelector = (
  className: keyof typeof CSS_CLASSES,
  state: CSS_STATES,
  backgroundClass?: keyof typeof CSS_CLASSES,
): string => {
  const baseClass = CSS_CLASSES[className];
  const stateClass = `${baseClass}-${state}`;
  if (backgroundClass) {
    return `${stateClass}.${CSS_CLASSES[backgroundClass]}`;
  }
  return stateClass;
};

// Text that truncates with a fade gradient effect or ellipsis
export const TruncatedText = styled(Typography)<{
  showFade?: boolean;
  showEllipsis?: boolean;
}>(({ theme, showFade, showEllipsis }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  position: 'relative',
  display: 'block',
  minWidth: 0,
  ...(showEllipsis && {
    textOverflow: 'ellipsis',
  }),
  '&::after': showFade
    ? {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '24px',
        background: `linear-gradient(to right, transparent, ${theme.palette.background.default})`,
        pointerEvents: 'none',
      }
    : {},
}));
