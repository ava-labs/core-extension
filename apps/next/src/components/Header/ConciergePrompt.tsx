import { Box, Stack, Typography, useTheme } from '@avalabs/k2-alpine';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  AnimatedButton,
  PromptButtonBackground,
  TextAnimation,
} from './components/styledComponents';
import { useFeatureFlagContext, useSettingsContext } from '@core/ui';
import { FeatureGates } from '@core/types';

export const ConciergePrompt = ({ isAIBackdropOpen, setIsAIBackdropOpen }) => {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();

  const [isHoverAreaHidden, setIsHoverAreaHidden] = useState(false);
  const { coreAssistant } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();
  const timer = useRef<NodeJS.Timeout>(null);
  const hasBackdropEntered = useRef(false);

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

  if (!coreAssistant || !featureFlags[FeatureGates.CORE_ASSISTANT]) {
    return null;
  }

  return (
    <>
      {/* THE BOX AREA WHERE WE WANT TO CATCH THE CURSOR */}
      <Stack
        className="prompt-hover-area"
        sx={{
          width: '100%',
          height: '40px',
          position: 'absolute',
          top: '56px',
          zIndex: isHoverAreaHidden ? 0 : theme.zIndex.tooltip - 1,
        }}
        onMouseEnter={() => {
          timer.current = setTimeout(() => {
            setIsAIBackdropOpen(true);
          }, 400);
        }}
        onMouseLeave={() => {
          if (!isAIBackdropOpen && timer.current) {
            clearTimeout(timer.current);
          }
        }}
      />
      <TransitionGroup component={null}>
        <Stack>
          {/* GRADIENT BACKGROUND */}
          <CSSTransition
            key={1}
            timeout={200}
            classNames="overlay"
            appear
            enter
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
          {/* BACKDROP */}
          <CSSTransition
            key={2}
            timeout={1000}
            classNames="backdrop"
            appear
            exit
            in={isAIBackdropOpen}
            nodeRef={nodeRef3}
            onExited={() => {
              hasBackdropEntered.current = false;
            }}
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
              onMouseMove={() => {
                if (hasBackdropEntered.current) {
                  setIsAIBackdropOpen(false);
                  setIsHoverAreaHidden(false);
                }
              }}
            />
          </CSSTransition>
          {/* THE BUTTON */}
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
                hasBackdropEntered.current = true;
              }, 500);
            }}
          >
            <Stack
              sx={{
                position: 'absolute',
                top: '56px',
                width: '100%',
                height: '40px',
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
  );
};
