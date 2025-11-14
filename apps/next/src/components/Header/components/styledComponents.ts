import {
  Button,
  getHexAlpha,
  keyframes,
  Stack,
  styled,
} from '@avalabs/k2-alpine';

export const AccountInfo = styled(Stack)`
  cursor: pointer;
  border-radius: 10px;
  padding: ${({ theme }) => theme.spacing(0.5)};
  transition: ${({ theme }) =>
    theme.transitions.create(['background', 'opacity'])};
  flex-direction: row;
  align-items: center;
  & > svg {
    opacity: 0;
  }
`;

export const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
  position: relative;
  &:hover > div:first-of-type {
    background: ${({ theme }) => getHexAlpha(theme.palette.primary.main, 10)};
    & > svg {
      opacity: 1;
    }
  }
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
  animation: 6000ms ease 0s infinite normal none running ${promptTextAnimation};
`;

const promptBackgroundAnimation = keyframes`
  to {
	  --angle: 360deg;
	}
`;

export const AnimatedButton = styled(Button)(({ theme }) => ({
  width: '90px',
  height: '3px',
  top: '7px',
  left: '50%',
  padding: 0,
  transform: 'translateX(-50%)',
  transition: `width 500ms linear,
			top 500ms linear,
			left 500ms linear,
      opacity 1000ms ease-in-out,
      height 500ms ease-in-out,
      transform 5550ms ease-in-out`,
  zIndex: theme.zIndex.appBar + 1,
  span: {
    display: 'none',
    opacity: '0',
    transition: `opacity 400ms linear, transform 600ms ease-in-out`,
    transform: 'scale(0)',
    h6: {
      transition: `opacity 1000ms linear, transform 600ms ease-in-out`,
      opacity: '0',
      transform: 'scale(0)',
    },
  },
  '&.button-enter': {
    span: {
      display: 'inline',
    },
  },
  '&.button-enter-done': {
    height: '42px',
    width: '100%',
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

export const PromptButtonBackground = styled(Stack)(({ theme }) => ({
  '--angle': '0deg',
  background: `conic-gradient(
      from var(--angle),
      rgba(255, 255, 255, 0) 0deg,
      #B0FF18 30deg,
      #A1FF68 60deg,
      #26F2FF 120deg,
      #7748FF 180deg,
      #FF048C 260deg,
      rgba(255, 255, 255, 0) 330deg
    )`,
  animation: `10s ${promptBackgroundAnimation} linear infinite`,
  borderRadius: 999,
  filter: `blur(50px)`,
  position: 'absolute',
  top: -100,
  left: 0,
  height: '200px',
  width: '100%',
  zIndex: theme.zIndex.appBar,
  pointerEvents: 'none',
}));

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
