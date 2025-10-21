import {
  getHexAlpha,
  InputAdornment,
  styled,
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
  const theme = useTheme();
  const [userMessageHistoryIndex, setUserMessageHistoryIndex] =
    useState<number>();
  const { t } = useTranslation();

  return (
    <BorderTextField
      placeholder={t('Core Concierge')}
      value={input}
      size="medium"
      sx={{
        color: 'grey.400',
        backgroundColor: getHexAlpha(theme.palette.grey[800], 60),
        borderRadius: 1,
      }}
      focused
      color="primary"
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              cursor: 'pointer',
            }}
          >
            <MdSend
              size={20}
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
