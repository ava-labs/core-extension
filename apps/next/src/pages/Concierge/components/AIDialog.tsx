import {
  Box,
  getHexAlpha,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useEffect, useMemo, useState } from 'react';
import { Typewriter } from './Typewriter';
import { PromptItem } from '@core/ui';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

export const AIBox = styled(Box)(({ theme }) => ({
  a: {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
  },
}));

export const AIDialog = ({
  message,
  scrollToBottom,
  lastMessage,
}: {
  message: PromptItem;
  scrollToBottom: () => void;
  isDialogOpen?: boolean;
  lastMessage?: boolean;
}) => {
  const theme = useTheme();
  const [isTextTyped, setIsTextTyped] = useState(!lastMessage);
  const { t } = useTranslation();

  const typingSpeed = useMemo(() => {
    if (message.content.length < 50) {
      return 20;
    }
    if (message.content.length > 50 && message.content.length <= 500) {
      return 10;
    }
    if (message.content.length > 500 && message.content.length <= 1000) {
      return 4;
    }
    if (message.content.length > 1000) {
      return 1;
    }
    return 5;
  }, [message.content.length]);

  useEffect(() => {
    if (isTextTyped) {
      scrollToBottom();
    }
  }, [isTextTyped, scrollToBottom]);

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        cursor: !isTextTyped ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (!isTextTyped) {
          setIsTextTyped(true);
          scrollToBottom();
        }
      }}
    >
      <img src="/images/core-dark-avatar.svg" width={43} height={43} />
      <Stack sx={{ ml: 1.5 }}>
        <Typography variant="h7">{t('Core Concierge')}</Typography>
        <AIBox
          sx={{
            backgroundColor: getHexAlpha(theme.palette.common.white, 15),
            py: 1,
            px: 2,
            mb: 2,
            maxWidth: '90%',
            width: 'fit-content',
            borderRadius: '20px',
            borderTopLeftRadius: '3px',
            justifySelf: 'flex-start',
            wordWrap: 'break-word',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {lastMessage && !isTextTyped && (
            <Typography>
              <Typewriter
                text={message.content}
                scrollToBottom={scrollToBottom}
                typingSpeed={typingSpeed}
              />
            </Typography>
          )}
          {(isTextTyped || !lastMessage) && (
            <Typography>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Typography>
          )}
        </AIBox>
      </Stack>
    </Stack>
  );
};
