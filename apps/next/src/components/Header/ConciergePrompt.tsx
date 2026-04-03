import {
  Box,
  getHexAlpha,
  Stack,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { FC, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [isButtonExpanded, setIsButtonExpanded] = useState(false);
  const { coreAssistant } = useSettingsContext();
  const { featureFlags } = useFeatureFlagContext();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const hasBackdropEntered = useRef(false);
  const isMac = navigator.platform.toUpperCase().includes('MAC');

  const buttonLabels = [
    t('Ask Core to send crypto'),
    t('Ask Core to swap tokens'),
    t('Ask Core to transfer for you'),
    t('Ask Core to manage accounts'),
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
          height: '48px',
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
          cursor: 'pointer',
          zIndex: isHoverAreaHidden ? 0 : theme.zIndex.tooltip - 1,
        }}
        onMouseEnter={() => {
          timer.current = setTimeout(() => {
            setIsAIBackdropOpen(true);
          }, 100);
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
            timeout={300}
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
        </Stack>
      </TransitionGroup>
      {/* THE BUTTON - rendered via portal to escape stacking context */}
      {createPortal(
        <CSSTransition
          timeout={300}
          classNames={CSS_CLASSES.BUTTON}
          appear
          exit
          in={isAIBackdropOpen}
          nodeRef={conciergeButtonRef}
          onEntered={() => {
            setTimeout(() => {
              setIsHoverAreaHidden(true);
              hasBackdropEntered.current = true;
              setIsButtonExpanded(true);
            }, 150);
          }}
          onExiting={() => {
            setIsButtonExpanded(false);
          }}
        >
          <Stack
            sx={{
              position: 'fixed',
              top: `${HEADER_HEIGHT}px`,
              left: 0,
              right: 0,
              px: 1.5,
              zIndex: theme.zIndex.appBar + 7,
            }}
          >
            <AnimatedButton
              variant="contained"
              sx={{
                borderColor: 'common.white_10',
                maxWidth: '100%',
                justifyContent: 'space-between',
                pl: 1.5,
                pr: 1.5,
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
              <Stack direction="row" alignItems="center">
                <Box component="span" sx={{ mr: 1, fontSize: 24 }}>
                  ✨
                </Box>
                <TextAnimation>
                  <Typography variant="subtitle3" fontWeight={400}>
                    {isAIBackdropOpen && getRandomButtonLabel()}
                  </Typography>
                </TextAnimation>
              </Stack>
              {isButtonExpanded && (
                <Stack direction="row" alignItems="center" gap="3px">
                  {isMac ? (
                    <Box
                      sx={{
                        backgroundColor: getHexAlpha('#FFFFFF', 10),
                        borderRadius: '50px',
                        height: 24,
                        px: 1,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">⌘K</Typography>
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          backgroundColor: getHexAlpha('#FFFFFF', 10),
                          borderRadius: '20px 3px 3px 20px',
                          height: 24,
                          px: 1,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2">Ctrl</Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: getHexAlpha('#FFFFFF', 10),
                          borderRadius: '3px 20px 20px 3px',
                          height: 24,
                          width: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2">K</Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              )}
            </AnimatedButton>
          </Stack>
        </CSSTransition>,
        document.body,
      )}
      {/* CANCEL ZONE - 24px below header */}
      {isAIBackdropOpen && (
        <Stack
          sx={{
            position: 'fixed',
            top: `${HEADER_HEIGHT + 48}px`, // header height + hover strip height
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.appBar + 6,
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
