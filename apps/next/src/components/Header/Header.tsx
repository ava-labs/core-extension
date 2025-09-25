import {
  Box,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import {
  useAccountsContext,
  useFeatureFlagContext,
  useSettingsContext,
} from '@core/ui';
import { useRef, useState } from 'react';
import { MdOutlineUnfoldMore } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { PersonalAvatar } from '../PersonalAvatar';
import { AddressList } from './AddressList';
import { HeaderActions } from './components/HeaderActions';
import { useTranslation } from 'react-i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  AccountInfo,
  AccountSelectContainer,
  AnimatedButton,
  PromptButtonBackground,
  TextAnimation,
} from './components/styledComponents';
import { FeatureGates } from '@core/types';

export const Header = () => {
  const { accounts } = useAccountsContext();
  const activeAccount = accounts.active;
  const theme = useTheme();
  const [isAddressAppear, setIsAddressAppear] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const [isAIBackdropOpen, setIsAIBackdropOpen] = useState(false);
  const [isHoverAreaHidden, setIsHoverAreaHidden] = useState(false);
  const { coreAssistant } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();

  const buttonLabels = [
    t('Ask Core Concierge to send crypto'),
    t('Ask Core Concierge to swap tokens'),
    t('Ask Core Concierge to bridge tokens'),
    t('Ask Core Concierge to transfer for you'),
    t('Ask Core Concierge to manage accounts'),
  ];

  const getRandomButtonLabel = () => {
    return buttonLabels[Math.floor(Math.random() * buttonLabels.length)];
  };

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
      {coreAssistant && featureFlags[FeatureGates.CORE_ASSISTANT] && (
        <>
          <Stack
            className="prompt-hover-area"
            sx={{
              width: '100%',
              height: '60px',
              position: 'absolute',
              top: '56px',
              zIndex: isHoverAreaHidden ? 0 : theme.zIndex.tooltip + 1,
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
                      display: 'block',
                    },
                    '.overlay-enter-done.prompt-background': {
                      display: 'block',
                      opacity: 1,
                    },
                    '.overlay-exit.prompt-background': {
                      display: 'block',
                      opacity: 1,
                    },
                    '.overlay-exit-done.prompt-background': {
                      display: 'block',
                      opacity: 0,
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
                        {isAIBackdropOpen && getRandomButtonLabel()}
                      </Typography>
                    </TextAnimation>
                  </AnimatedButton>
                </Stack>
              </CSSTransition>
            </Stack>
          </TransitionGroup>
        </>
      )}
    </Stack>
  );
};
