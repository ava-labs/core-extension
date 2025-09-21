import {
  Box,
  Button,
  getHexAlpha,
  keyframes,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useAccountsContext } from '@core/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { PersonalAvatar } from '../PersonalAvatar';
import { AddressList } from './AddressList';
import { HeaderActions } from './components/HeaderActions';
import { useTranslation } from 'react-i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

CSS.registerProperty({
  name: '--angle',
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});

const AccountInfo = styled(Stack)`
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

const AccountSelectContainer = styled(Stack)`
  cursor: pointer;
  position: relative;
  &:hover > div:first-of-type {
    background: ${({ theme }) => getHexAlpha(theme.palette.primary.main, 10)};
    & > svg {
      opacity: 1;
    }
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
`;

const promptBackgroundAnimation = keyframes`
  to {
	  --angle: 360deg;
	}
`;

const AnimatedButton = styled(Button)(({ theme }) => ({
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
  [`${Box}`]: {
    display: 'none',
  },
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
  '&.button-enter-active': {
    span: {
      // opacity: '1',
      // h6: {
      //   transition: `opacity 11000ms linear`,
      // },
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
  // display: isHidden ? 'none' : 'flex',
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
  width: '345px',
  zIndex: theme.zIndex.appBar,
  pointerEvents: 'none',
}));

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const [isAddressAppear, setIsAddressAppear] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);
  const [isHoverAreaHidden, setIsHoverAreaHidden] = useState(false);

  const [index, setIndex] = useState(0);
  const buttonLabels = useMemo(() => {
    return [
      t('Ask Core Concierge to send crypto'),
      t('Ask Core Concierge to swap tokens'),
      t('Ask Core Concierge to bridge tokens'),
      t('Ask Core Concierge to transfer for you'),
      t('Ask Core Concierge to manage accounts'),
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

  const nodeRef = useRef(null);
  const nodeRef2 = useRef(null);
  const nodeRef3 = useRef(null);

  // TODO: fix this after the transactions will be implemented
  // TODO: fix the icon in k2 dark mode.....
  // the true will rotate
  const isTransactionPending = false;

  return (
    <Stack
      sx={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: theme.zIndex.appBar,
        borderBottom: `1px solid ${getHexAlpha(theme.palette.primary.main, 10)}`,
      }}
    >
      <Stack
        direction="row"
        sx={{
          background: theme.palette.background.default,
          width: '100%',
          height: '56px',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          zIndex: theme.zIndex.tooltip + 1,
        }}
        onMouseEnter={() => {
          setIsAIBackdropOpen(false);
          setIsHoverAreaHidden(false);
        }}
      >
        <AccountSelectContainer
          onMouseOver={() => setIsAddressAppear(true)}
          onMouseLeave={() => setIsAddressAppear(false)}
          onClick={() => history.push('/account-management')}
        >
          <AccountInfo>
            <PersonalAvatar cached size="xsmall" sx={{ mr: 1 }} />
            <Typography variant="body2">{activeAccount?.name}</Typography>
            <MdOutlineUnfoldMore
              size={24}
              color={getHexAlpha(theme.palette.primary.main, 70)}
            />
          </AccountInfo>
          <AddressList
            isAddressAppear={isAddressAppear}
            activeAccount={activeAccount}
          />
        </AccountSelectContainer>
        <HeaderActions
          activeAccount={activeAccount}
          pendingTransaction={isTransactionPending}
        />
      </Stack>
      <Stack
        className="prompt-hover-area"
        sx={{
          width: '100%',
          height: '60px',
          position: 'absolute',
          top: '56px',
          // background: 'red',
          zIndex: isHoverAreaHidden ? 0 : theme.zIndex.tooltip + 1,
          // pointerEvents: isAIBackdropOpen ? 'none' : 'all',
        }}
        onMouseEnter={() => {
          setIsAIBackdropOpen(true);
        }}
      />
      <TransitionGroup component={null}>
        <Stack>
          <CSSTransition
            key={1}
            timeout={200}
            classNames="overlay"
            appear
            exit
            in={isAIBackdropOpen}
            // in
            nodeRef={nodeRef2}
          >
            <Stack
              sx={{
                '.prompt-background': {
                  display: 'none',
                  opacity: 0,
                  transition: `opacity 400ms linear`,
                },
                '.overlay-enter.prompt-background': {
                  // '.prompt-background': {
                  display: 'block',
                  // },
                },
                '.overlay-enter-done.prompt-background': {
                  display: 'block',
                  opacity: 1,
                },
              }}
            >
              <PromptButtonBackground
                ref={nodeRef2}
                className="prompt-background"
              />
            </Stack>
          </CSSTransition>
          <CSSTransition
            key={2}
            timeout={1000}
            classNames="backdrop"
            appear
            exit
            in={isAIBackdropOpen}
            nodeRef={nodeRef3}
          >
            <Stack
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#28282ECC',
                backdropFilter: 'none',
                display: 'none',
                transition: 'opacity 400ms linear',
                opacity: 0,
                zIndex: theme.zIndex.appBar - 1,
                '&.backdrop-enter': {
                  display: 'flex',
                },
                '&.backdrop-enter-done': {
                  display: 'flex',
                  opacity: 1,
                },
              }}
              ref={nodeRef3}
              onMouseEnter={() => {
                setIsAIBackdropOpen(false);
                setIsHoverAreaHidden(false);
              }}
            />
          </CSSTransition>
          <CSSTransition
            key={3}
            timeout={1000}
            classNames="button"
            appear
            exit
            in={isAIBackdropOpen}
            nodeRef={nodeRef}
            onEntered={() => {
              // it needs to be delayed (waiting for the button animation getting done) to avoid the glitch
              setTimeout(() => {
                setIsHoverAreaHidden(true);
              }, 500);
            }}
          >
            <Stack
              sx={{
                position: 'absolute',
                top: '56px',
                width: '100%',
                height: '70px',
                px: 1.5,
              }}
            >
              <AnimatedButton
                color="primary"
                variant="contained"
                sx={{
                  borderColor: 'common.white_10',
                  maxWidth: '100%',
                  justifyContent: 'flex-start',
                  px: 1.5,
                  backgroundColor: 'common.white_30',
                  color: 'text.primary',
                }}
                onClick={() => {
                  history.push('/concierge');
                }}
                size="large"
                fullWidth
                ref={nodeRef}
              >
                <Box component="span" sx={{ mr: 1, fontSize: 24 }}>
                  ✨
                </Box>
                <TextAnimation>
                  <Typography variant="subtitle3">
                    {buttonLabels[index]}
                  </Typography>
                </TextAnimation>
              </AnimatedButton>
            </Stack>
          </CSSTransition>
        </Stack>
      </TransitionGroup>
    </Stack>
  );
};
