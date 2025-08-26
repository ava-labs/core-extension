import { Fade, Stack } from '@avalabs/k2-alpine';
import {
  InvisibleNameInput,
  NAME_INPUT_HEIGHT,
  StyledNameButton,
} from './InvisibleInput';

type NameFieldProps = {
  name: string;
  setName: (name: string) => void;
  isNaming: boolean;
  setIsNaming: (isNaming: boolean) => void;
  autoFocus: boolean;
  prompt: string;
};

export const NameField = ({
  name,
  setName,
  isNaming,
  setIsNaming,
  autoFocus,
  prompt,
}: NameFieldProps) => {
  return (
    <Stack
      width="100%"
      position="relative"
      overflow="hidden"
      height={NAME_INPUT_HEIGHT}
    >
      <Fade in={isNaming} mountOnEnter unmountOnExit>
        <InvisibleNameInput
          sx={{
            position: 'absolute',
            paddingInline: 0,
            width: '100%',
          }}
          value={name}
          autoFocus={autoFocus}
          onBlur={(e) => setIsNaming(e.target.value.trim().length > 0)}
          onChange={(e) => setName(e.target.value)}
        />
      </Fade>
      <Fade in={!isNaming} mountOnEnter unmountOnExit>
        <StyledNameButton
          variant="contained"
          color="secondary"
          size="extension"
          onClick={() => setIsNaming(true)}
        >
          {prompt}
        </StyledNameButton>
      </Fade>
    </Stack>
  );
};
