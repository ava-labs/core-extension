import {
  Box,
  Button,
  keyframes,
  Stack,
  styled,
} from '@avalabs/core-k2-components';
import { useEffect, useMemo, useState } from 'react';
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
  25% {
		background-position: 50% 75%;
    --angle2: 135deg;
	}
	50% {
		background-position: 100% 100%;
    --angle2: 0deg;
	}
	75% {
		background-position: 50% 75%;
    --angle2: -45deg;
	}
	100% {
		background-position: 0% 50%;
    --angle2: -90deg;
	}
`;

const promptTextAnimation = keyframes`
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

const TextAnimation = styled('span')`
  animation: 6000ms ease 0s infinite normal none running ${promptTextAnimation};
  overflow: hidden;
`;

CSS.registerProperty({
  name: '--angle',
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});
CSS.registerProperty({
  name: '--angle2',
  syntax: '<angle>',
  inherits: false,
  initialValue: '270deg',
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
  justifyContent: 'left',
  overflow: 'hidden',
  fontWeight: 500,
  fontSize: 13,
}));

const PromptStack = styled(Stack)(({ theme }) => ({
  height: '40px',
  marginTop: 16,
  marginBottom: 8,
  marginLeft: 16,
  marginRight: 16,
  position: 'relative',
  '&:hover > div': {
    transition: 'all 0.15s ease-in-out',
    color: theme.palette.grey[900],
    backgroundSize: '150% 150%',
    animation: `10s ${promptButtonBackgroundAnimation} linear infinite`,
    filter: `blur(12.6px)`,
    background:
      'conic-gradient(from var(--angle2) at 50% 50%, rgba(255, 9, 127, 0.00) 1.7510020360350609deg, rgba(176, 255, 24, 0.00) 22.6304030418396deg, #A1FF68 100.64207816123962deg, #26F2FF 160deg, #7748FF 250deg, rgba(255, 4, 140, 0.75) 344.3039059638977deg)',
  },
  ':hover > button': {
    color: theme.palette.grey[900],
    backgroundSize: '150% 150%',
    background: 'rgba(255,255,255, 0.6)',
  },
}));

export const PromptButton = ({ onClick }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const buttonLabels = useMemo(() => {
    return [
      t('Core AI - Manage your wallet'),
      t('Core assistant pick up where you left off'),
      t('Ask Core to transfer funds'),
    ].sort(() => 0.5 - Math.random());
  }, [t]);

  useEffect(() => {
    const getNextLabel = () =>
      setIndex((i) => {
        if (i >= buttonLabels.length - 1) {
          return 0;
        }
        return i + 1;
      });
    const id = setInterval(getNextLabel, 6000);
    return () => clearInterval(id);
  }, [buttonLabels.length]);

  return (
    <PromptStack onClick={onClick}>
      <PromptButtonBackground hasAnimation />
      <PromptButtonStyled size="medium">
        <Box component="span" sx={{ mr: 1, fontSize: 24 }}>
          ✨
        </Box>
        <TextAnimation>{buttonLabels[index]}</TextAnimation>
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
