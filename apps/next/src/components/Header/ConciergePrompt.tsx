import {
  Box,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  AnimatedButton,
  CSS_CLASSES,
  PromptButtonBackground,
  TextAnimation,
} from './components/styledComponents';
import { useFeatureFlagContext, useSettingsContext } from '@core/ui';
import { FeatureGates } from '@core/types';
import { ConciergePromptBackground } from './components/ConciergePromptBackground';
import { ConciergeBackdrop } from './components/ConciergeBackdrop';
import { HEADER_HEIGHT } from '@/config/constants';

type ConciergePromptProps = {
  isAIBackdropOpen: boolean;
  setIsAIBackdropOpen: (isOpen: boolean) => void;
};

export const ConciergePrompt: FC<ConciergePromptProps> = ({
  isAIBackdropOpen,
  setIsAIBackdropOpen,
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();

  const [isHoverAreaHidden, setIsHoverAreaHidden] = useState(false);
  const { coreAssistant } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();
  const timer = useRef<NodeJS.Timeout | null>(null);
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

  const conciergeButtonRef = useRef(null);
  const conciergeBackgroundRef = useRef(null);
  const conciergeBackdropRef = useRef(null);

  if (!coreAssistant || !featureFlags[FeatureGates.CORE_ASSISTANT]) {
    return null;
  }

  return (
    <>
      {/* THE BOX AREA WHERE WE WANT TO CATCH THE CURSOR */}
      <Stack
        sx={{
          width: '100%',
          height: '24px',
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
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
            classNames={CSS_CLASSES.OVERLAY}
            appear
            enter
            exit
            in={isAIBackdropOpen}
            nodeRef={conciergeBackgroundRef}
          >
            <ConciergePromptBackground>
              <PromptButtonBackground
                ref={conciergeBackgroundRef}
                className={CSS_CLASSES.PROMPT_BACKGROUND}
              />
            </ConciergePromptBackground>
          </CSSTransition>
          {/* BACKDROP */}
          <CSSTransition
            key={2}
            timeout={1000}
            classNames={CSS_CLASSES.BACKDROP}
            appear
            exit
            in={isAIBackdropOpen}
            nodeRef={conciergeBackdropRef}
            onExited={() => {
              hasBackdropEntered.current = false;
            }}
          >
            <ConciergeBackdrop
              conciergeBackdropRef={conciergeBackdropRef}
              hasBackdropEntered={hasBackdropEntered}
              setIsAIBackdropOpen={setIsAIBackdropOpen}
              setIsHoverAreaHidden={setIsHoverAreaHidden}
            />
          </CSSTransition>
          {/* THE BUTTON */}
          <CSSTransition
            key={3}
            timeout={1000}
            classNames={CSS_CLASSES.BUTTON}
            appear
            exit
            in={isAIBackdropOpen}
            nodeRef={conciergeButtonRef}
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
                top: `${HEADER_HEIGHT}px`,
                width: '100%',
                px: 1.5,
                zIndex: theme.zIndex.appBar + 3,
              }}
            >
              <AnimatedButton
                variant="contained"
                sx={{
                  borderColor: 'common.white_10',
                  maxWidth: '100%',
                  justifyContent: 'flex-start',
                  px: 1.5,
                  backgroundColor: getHexAlpha(theme.palette.text.primary, 30),
                  color: 'common.white',
                }}
                onClick={() => {
                  history.push('/concierge');
                }}
                size="large"
                fullWidth
                ref={conciergeButtonRef}
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
      {/* CANCEL ZONE - 24px below header */}
      {isAIBackdropOpen && (
        <Stack
          sx={{
            position: 'fixed',
            top: `${HEADER_HEIGHT + 24}px`, // header height + 24px hover area
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.appBar + 2,
          }}
          onMouseEnter={() => {
            setIsAIBackdropOpen(false);
            setIsHoverAreaHidden(false);
          }}
        />
      )}
    </>
  );
};
