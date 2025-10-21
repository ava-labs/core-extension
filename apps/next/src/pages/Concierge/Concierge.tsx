import { keyframes, Slide, Stack } from '@avalabs/k2-alpine';
import { useFirebaseContext } from '@core/ui';
import { useEffect, useRef, useState } from 'react';
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
      <Stack>
        <Stack
          sx={{
            backgroundImage: 'url(/images/ai-prompt-bg.svg)',
            backgroundSize: 'cover',
            position: 'absolute',
            top: '300px',
            left: '-150px',
            width: '600px',
            height: '600px',
            animation: `15s ${promptBackgroundAnimation} ease-in infinite`,
          }}
        />
        <Page withBackButton px={0}>
          <Stack
            sx={{
              height: '100%',
              width: '100%',
            }}
          >
            <Scrollbars
              ref={scrollbarRef}
              style={{ height: '100%', width: '100%' }}
            >
              <Stack sx={{ p: 1.5, flexGrow: 1 }}>
                {prompts.map((message, i) => {
                  if (message.role === 'model') {
                    return (
                      <AIDialog
                        message={message}
                        key={i}
                        scrollToBottom={
                          scrollbarRef.current?.scrollToBottom || (() => {})
                        }
                        lastMessage={i === prompts.length - 1}
                      />
                    );
                  }
                  return <UserDialog message={message} key={i} />;
                })}
                {isTyping && <TypingAvatar />}
              </Stack>
            </Scrollbars>
            <Stack sx={{ pt: 1.5, px: 1.5 }}>
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
