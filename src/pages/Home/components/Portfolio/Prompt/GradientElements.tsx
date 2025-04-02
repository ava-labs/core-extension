import { Button, keyframes, Stack, styled } from '@avalabs/core-k2-components';
import { useTranslation } from 'react-i18next';

const promptBackgroundAnimation = keyframes`
 to {
		--angle: 360deg;
	}
`;

const promptButtonBackgroundAnimation = keyframes`
    0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

CSS.registerProperty({
  name: '--angle',
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});

export const PromptButtonBackground = styled(Stack)(
  ({ hasAnimation }: any) => ({
    background: `conic-gradient(
      from var(--angle),
      #000000 0deg,
      #B0FF18 30deg,
      #A1FF68 60deg,
      #26F2FF 120deg,
      #7748FF 180deg,
      #FF048C 260deg,
      #000000 330deg
    )`,
    // background: 'black',
    animation: hasAnimation
      ? `10s ${promptBackgroundAnimation} linear infinite`
      : 'none',
    borderRadius: 999,
    filter: `blur(2px)`,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '42px',
    width: '345px',
  }),
);
const PromptButtonStyled = styled(Button)(() => ({
  background: 'black',
  color: 'white',
  height: '40px',
  width: '343px',
  position: 'absolute',
  top: 2,
  left: 2,
}));

const PromptStack = styled(Stack)(({ theme }) => ({
  width: '100%',
  height: '40px',
  marginTop: 16,
  marginBottom: 8,
  marginLeft: 16,
  marginRight: 16,
  position: 'relative',
  '&:hover > div': {
    color: theme.palette.grey[900],
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    backgroundSize: '400% 400%',
    animation: `15s ${promptButtonBackgroundAnimation} ease infinite`,
    filter: `blur(10px)`,
  },
  '&:hover > button': {
    color: theme.palette.grey[900],
    background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
    backgroundSize: '400% 400%',
    animation: `15s ${promptButtonBackgroundAnimation} ease infinite`,
  },
}));

export const PromptButton = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <PromptStack onClick={onClick}>
      <PromptButtonBackground hasAnimation />
      <PromptButtonStyled size="medium">
        ✨{t('Core AI - Manage your wallet')}
      </PromptButtonStyled>
    </PromptStack>
  );
};

export const PromptBackground = styled(Stack)(({ hasAnimation }: any) => ({
  background: `conic-gradient(
      from var(--angle),
      #000000 0deg,
      #B0FF18 50deg,
      #A1FF68 100deg,
      #26F2FF 140deg,
      #7748FF 180deg,
      #FF048C 220deg,
      #000000 270deg
    )`,
  opacity: 0.2,
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  animation: hasAnimation
    ? `10s ${promptBackgroundAnimation} linear infinite`
    : 'none',
}));
