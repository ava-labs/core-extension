import { Slide, Stack } from '@avalabs/k2-alpine';
import { useFirebaseContext } from '@core/ui';
import { useEffect, useRef, useState } from 'react';
import { AIDialog } from './components/AIDialog';
import { UserDialog } from './components/UserDialog';
import { UserInput } from './components/UserInput';
import { TypingAvatar } from './components/TypingAvatar';
import { useFunctions } from './hooks/useFunctions';
import { Page } from '@/components/Page';
import Scrollbars from 'react-custom-scrollbars-2';

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
      <Page withBackButton>
        <Stack
          sx={{
            // width: '375px',
            // height: '568px',
            height: '100%',
            width: '100%',
            // m: 2,
            // overflow: 'hidden',
            position: 'relative',
            // backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Scrollbars
            ref={scrollbarRef}
            style={{ height: '100%', width: '100%' }}
          >
            <Stack sx={{ p: 2, flexGrow: 1 }}>
              {prompts.map((message, i) => {
                if (message.role === 'model') {
                  return (
                    <AIDialog
                      message={message}
                      key={i}
                      scrollToBottom={
                        scrollbarRef.current?.scrollToBottom || (() => {})
                      }
                      isDialogOpen
                    />
                  );
                }
                return <UserDialog message={message} key={i} />;
              })}
              {isTyping && <TypingAvatar />}
            </Stack>
          </Scrollbars>
          <Stack sx={{ p: 2 }}>
            <UserInput
              input={input}
              setInput={setInput}
              setPrompt={prompt}
              userMessages={userMessages}
            />
          </Stack>
        </Stack>
      </Page>
    </Slide>
  );
};
