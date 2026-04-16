import { keyframes, Slide, Stack } from '@avalabs/k2-alpine';
import { useFirebaseContext } from '@core/ui';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AIDialog } from './components/AIDialog';
import { UserDialog } from './components/UserDialog';
import { UserInput } from './components/UserInput';
import { TypingAvatar } from './components/TypingAvatar';
import { useFunctions } from './hooks/useFunctions';
import { Page } from '@/components/Page';
import Scrollbars from 'react-custom-scrollbars-2';

const promptBackgroundAnimation = keyframes`
 	0%{
    transform: rotate(0deg);
  }
  100% {
	  transform: rotate(360deg);
	}
`;

export const Concierge = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollbarRef = useRef<Scrollbars | null>(null);
  const { prompts } = useFirebaseContext();
  const { prompt, userMessages } = useFunctions({ setIsTyping, setInput });

  useEffect(() => {
    if (isTyping) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [isTyping]);

  return (
    <Slide in direction="up">
      <Stack
        sx={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Page
          title={t('Core Concierge')}
          showContentTitle={false}
          withBackButton
          px={0}
          containerProps={{
            mt: 0,
          }}
        >
          <Stack
            sx={{
              backgroundImage: 'url(/images/ai-prompt-bg.svg)',
              backgroundSize: 'cover',
              position: 'fixed',
              bottom: '-300px',
              left: '-200px',
              zIndex: 0,
              width: '600px',
              height: '600px',
              animation: `15s ${promptBackgroundAnimation} ease-in infinite`,
            }}
          />
          <Stack
            sx={{
              height: '100%',
              width: '100%',
              zIndex: 10,
            }}
          >
            <Stack style={{ height: '100%', width: '100%' }}>
              <Stack
                sx={{ p: 1.5, minHeight: '100%', justifyContent: 'flex-end' }}
              >
                {prompts.map((message, index) => {
                  if (message.role === 'model') {
                    const previousPrompt = prompts[index - 1];
                    const isConsecutive = previousPrompt?.role === 'model';

                    return (
                      <AIDialog
                        message={message}
                        key={index}
                        scrollToBottom={
                          scrollbarRef.current?.scrollToBottom || (() => {})
                        }
                        lastMessage={index === prompts.length - 1}
                        isConsecutive={isConsecutive}
                      />
                    );
                  }
                  return <UserDialog message={message} key={index} />;
                })}
                {isTyping && <TypingAvatar />}
              </Stack>
            </Stack>
            <Stack
              sx={{
                pt: 1.5,
                px: 1.5,
                position: 'sticky',
                bottom: 12,
                zIndex: 10,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(30px)',
              }}
            >
              <UserInput
                input={input}
                setInput={setInput}
                setPrompt={prompt}
                userMessages={userMessages}
              />
            </Stack>
          </Stack>
        </Page>
      </Stack>
    </Slide>
  );
};
