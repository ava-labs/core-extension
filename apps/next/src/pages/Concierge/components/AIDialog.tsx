import {
  AvatarHex,
  Box,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@avalabs/k2-alpine';
import { useEffect, useMemo, useState } from 'react';
import { Typewriter } from './Typewriter';
import { PromptItem } from '@core/ui';
import ReactMarkdown from 'react-markdown';

export const AIBox = styled(Box)(({ theme }) => ({
  a: {
    color: theme.palette.text.primary,
    textDecoration: 'underline',
  },
}));

export const AIDialog = ({
  message,
  scrollToBottom,
  isDialogOpen,
}: {
  message: PromptItem;
  scrollToBottom: () => void;
  isDialogOpen?: boolean;
}) => {
  const theme = useTheme();
  const [isTextTyped, setIsTextTyped] = useState(false);

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
    if (!isTextTyped && !isDialogOpen) {
      setIsTextTyped(true);
    }
  }, [isTextTyped, isDialogOpen]);

  return (
    <Stack
      sx={{
        flexDirection: 'row',
        cursor: !isTextTyped ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (!isTextTyped) {
          setIsTextTyped(true);
        }
      }}
    >
      <AvatarHex size="small" alt="Consierge" />
      <AIBox
        sx={{
          backgroundColor: theme.palette.grey[800],
          py: 1,
          px: 2,
          my: 2,
          maxWidth: '80%',
          width: 'fit-content',
          borderRadius: '20px',
          borderTopLeftRadius: '3px',
          justifySelf: 'flex-start',
          wordWrap: 'break-word',
          marginLeft: -1,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {!isTextTyped && (
          <Typography>
            <Typewriter
              text={message.content}
              scrollToBottom={scrollToBottom}
              typingSpeed={typingSpeed}
            />
          </Typography>
        )}
        {isTextTyped && (
          <Typography>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Typography>
        )}
      </AIBox>
    </Stack>
  );
};
