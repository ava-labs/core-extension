import {
  Box,
  InputAdornment,
  keyframes,
  SendIcon,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@avalabs/core-k2-components';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PromptItem } from '@src/contexts/FirebaseProvider';
import { Typewriter } from './Typewriter';
import ReactMarkdown from 'react-markdown';

const Avatar = styled(Stack)(() => ({
  position: 'relative',
  marginLeft: '-24px',
  height: '85px',
  '.text': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
      <Avatar>
        <img src="images/ai-avatar.svg" />
        <img src="images/ai-avatar-text.svg" className="text" />
      </Avatar>
      <Box
        sx={{
          backgroundColor: theme.palette.grey[850],
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
      </Box>
    </Stack>
  );
};

export const UserDialog = ({ message }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.common.white,
        py: 1,
        px: 2,
        my: 1,
        maxWidth: '80%',
        width: 'fit-content',
        borderRadius: '20px',
        borderTopRightRadius: '3px',
        alignSelf: 'flex-end',
        wordWrap: 'break-word',
        color: theme.palette.grey[900],
      }}
    >
      <Typography>{message.content}</Typography>
    </Stack>
  );
};

interface UserInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  setPrompt: (message: string) => Promise<void>;
  userMessages?: string[];
}

const BorderTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset.MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

export const UserInput = ({
  input,
  setInput,
  setPrompt,
  userMessages,
}: UserInputProps) => {
  const [userMessageHistoryIndex, setUserMessageHistoryIndex] =
    useState<number>();
  const { t } = useTranslation();

  return (
    <BorderTextField
      placeholder={t('Core Concierge')}
      value={input}
      size="large"
      sx={{
        color: 'grey.400',
        backgroundColor: 'grey.800',
        borderRadius: 1,
      }}
      focused
      color="primary"
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SendIcon
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => {
                if (input) {
                  setPrompt(input);
                }
              }}
            />
          </InputAdornment>
        ),
      }}
      onChange={(e) => {
        setInput(e.target.value);
      }}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && input) {
          e.preventDefault();
          setPrompt(input);
          setUserMessageHistoryIndex(userMessages?.length || 1);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'ArrowUp' && userMessages) {
          const index =
            userMessageHistoryIndex || userMessageHistoryIndex === 0
              ? userMessageHistoryIndex - 1
              : userMessages.length - 1;
          const message = userMessages[index];

          if (message) {
            setInput(message);
          }
          if (index > 0) {
            setUserMessageHistoryIndex(index);
          }
        }
        if (e.key === 'ArrowDown' && userMessages) {
          const index =
            userMessageHistoryIndex || userMessageHistoryIndex === 0
              ? userMessageHistoryIndex + 1
              : userMessages.length - 1;
          const message = userMessages[index];

          if (message) {
            setInput(message);
          }
          if (index < userMessages.length - 1) {
            setUserMessageHistoryIndex(index);
          }
        }
      }}
    />
  );
};

const typingAnimation = keyframes`
 0% {
		cy: 25px
	}
 20% {
		cy: 20px
	}
 40% {
		cy: 25px
	}
`;

const TypingAnimation = styled('svg')`
  & > circle.first {
    cy: 25px;
    animation: ${typingAnimation} 1.5s ease-in-out infinite;
  }
  & > circle.second {
    cy: 25px;
    animation: ${typingAnimation} 1.5s ease-in-out 0.2s infinite;
  }
  & > circle.third {
    cy: 25px;
    animation: ${typingAnimation} 1.5s ease-in-out 0.4s infinite;
  }
`;

export const TypingAvatar = () => {
  return (
    <TypingAnimation
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M19.2 2.77128C22.1702 1.05641 25.8297 1.05641 28.8 2.77128L39.9846 9.22872C42.9549 10.9436 44.7846 14.1128 44.7846 17.5426V30.4574C44.7846 33.8872 42.9549 37.0564 39.9846 38.7713L28.8 45.2287C25.8297 46.9436 22.1702 46.9436 19.2 45.2287L8.01539 38.7713C5.04514 37.0564 3.21539 33.8872 3.21539 30.4574V17.5426C3.21539 14.1128 5.04514 10.9436 8.01539 9.22872L19.2 2.77128Z"
        fill="#58585B"
        fillOpacity="0.5"
      />
      <path
        d="M19.45 3.20429C22.2655 1.57874 25.7344 1.57874 28.55 3.20429L39.7346 9.66173C42.5502 11.2873 44.2846 14.2914 44.2846 17.5426V30.4574C44.2846 33.7085 42.5502 36.7127 39.7346 38.3383L28.55 44.7957C25.7344 46.4213 22.2655 46.4213 19.45 44.7957L8.26539 38.3383C5.44984 36.7127 3.71539 33.7086 3.71539 30.4574V17.5426C3.71539 14.2914 5.44984 11.2873 8.26539 9.66173L19.45 3.20429Z"
        stroke="white"
        strokeOpacity="0.1"
      />
      <circle cx="18" cy="25" r="2" fill="#B4B4B7" className="first" />
      <circle cx="24" cy="21" r="2" fill="#B4B4B7" className="second" />
      <circle cx="30" cy="25" r="2" fill="#B4B4B7" className="third" />
    </TypingAnimation>
  );
};
