import {
  Box,
  getHexAlpha,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useEffect, useState } from 'react';
import { Typewriter } from './Typewriter';
import { PromptItem } from '@core/ui';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

const AIBox = styled(Box)(({ theme }) => ({
  a: {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
  },
  p: {
    margin: 0,
  },
}));

const getTypingSpeed = (message: PromptItem) => {
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
};

export const AIDialog = ({
  message,
  scrollToBottom,
  lastMessage,
  isConsecutive,
}: {
  message: PromptItem;
  scrollToBottom: () => void;
  isDialogOpen?: boolean;
  lastMessage?: boolean;
  isConsecutive?: boolean;
}) => {
  const theme = useTheme();
  const [isTextTyped, setIsTextTyped] = useState(!lastMessage);
  const { t } = useTranslation();
  const typingSpeed = getTypingSpeed(message);

  useEffect(() => {
    if (isTextTyped) {
      scrollToBottom();
    }
  }, [isTextTyped, scrollToBottom]);

  // Light: rgba(40, 40, 46, 0.1), Dark: rgba(255, 255, 255, 0.1) per Figma
  const isLight = theme.palette.mode === 'light';
  const bubbleBackground = isLight
    ? getHexAlpha('#28282E', 10)
    : getHexAlpha('#FFFFFF', 10);

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
      {!isConsecutive && (
        <img
          src={
            theme.palette.mode === 'light'
              ? '/images/core-light-avatar.svg'
              : '/images/core-dark-avatar.svg'
          }
          width={43}
          height={43}
          alt=""
        />
      )}
      <Stack
        sx={{
          ml: isConsecutive ? 0 : 1.5,
          ...(isConsecutive && {
            paddingLeft: `calc(43px + ${theme.spacing(1.5)})`,
          }),
        }}
      >
        {!isConsecutive && (
          <Typography variant="h7">{t('Core Concierge')}</Typography>
        )}
        <AIBox
          sx={{
            backgroundColor: bubbleBackground,
            py: 1,
            px: 1.5,
            mt: isConsecutive ? 0 : 0.5,
            mb: isConsecutive ? 0.75 : 1.5,
            maxWidth: '90%',
            width: 'fit-content',
            borderRadius: isConsecutive ? '15px' : '3px 15px 15px 15px',
            justifySelf: 'flex-start',
            wordWrap: 'break-word',
            overflow: 'hidden',
            wordBreak: 'break-word',
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
