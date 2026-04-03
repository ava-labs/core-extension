import {
  getHexAlpha,
  InputAdornment,
  TextField,
  useTheme,
} from '@avalabs/k2-alpine';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdSend } from 'react-icons/md';

interface UserInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  setPrompt: (message: string) => Promise<void>;
  userMessages?: string[];
}

export const UserInput = ({
  input,
  setInput,
  setPrompt,
  userMessages,
}: UserInputProps) => {
  const theme = useTheme();
  const [userMessageHistoryIndex, setUserMessageHistoryIndex] =
    useState<number>();
  const { t } = useTranslation();
  const hasMessage = input.trim().length > 0;
  const isLight = theme.palette.mode === 'light';

  // Light: rgba(255, 255, 255, 0.6), Dark: rgba(40, 40, 46, 0.6) per Figma
  const inputBackground = isLight
    ? getHexAlpha('#FFFFFF', 60)
    : getHexAlpha('#28282E', 60);

  return (
    <TextField
      variant="outlined"
      placeholder={t('Ask me to buy crypto')}
      value={input}
      size="medium"
      multiline
      minRows={2}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: inputBackground,
          padding: '11px 13.5px',
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
        },
        '& .MuiOutlinedInput-input': {
          color: theme.palette.text.primary,
          padding: 0,
          '&::placeholder': {
            opacity: 0.5,
            color: theme.palette.text.primary,
          },
        },
      }}
      color="primary"
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              cursor: hasMessage ? 'pointer' : 'default',
              marginRight: theme.spacing(0.5),
            }}
          >
            <MdSend
              size={20}
              color={theme.palette.text.secondary}
              style={{
                opacity: hasMessage ? 1 : 0.38,
                pointerEvents: hasMessage ? 'auto' : 'none',
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && input) {
          e.preventDefault();
          setPrompt(input);
          setUserMessageHistoryIndex(userMessages?.length || 1);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'ArrowUp' && userMessages) {
          const index =
            userMessageHistoryIndex && userMessageHistoryIndex >= 0
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
            userMessageHistoryIndex &&
            userMessageHistoryIndex >= 0 &&
            userMessageHistoryIndex < userMessages.length - 1
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
