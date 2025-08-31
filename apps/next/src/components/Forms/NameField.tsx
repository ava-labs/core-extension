import { Fade, Stack, useTheme } from '@avalabs/k2-alpine';
import {
  InvisibleNameInput,
  NAME_INPUT_HEIGHT,
  StyledNameButton,
} from './InvisibleInput';
import { EditIcon } from './assets/EditIcon';

type NameFieldProps = {
  name: string;
  setName: (name: string) => void;
  isNaming: boolean;
  setIsNaming: (isNaming: boolean) => void;
  autoFocus: boolean;
  prompt: string;
  readOnly: boolean;
  showEditIcon?: boolean;
};

export const NameField = ({
  name,
  setName,
  isNaming,
  setIsNaming,
  autoFocus,
  prompt,
  readOnly,
  showEditIcon = false,
}: NameFieldProps) => {
  const theme = useTheme();
  const showPrompt = !isNaming && name.trim().length === 0;

  return (
    <Stack
      width="100%"
      position="relative"
      overflow="hidden"
      height={NAME_INPUT_HEIGHT}
    >
      <Fade in={!showPrompt} mountOnEnter unmountOnExit>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          position="absolute"
          paddingInline={0}
          width="100%"
        >
          <InvisibleNameInput
            value={name}
            autoFocus={autoFocus}
            onBlur={(e) => setIsNaming(e.target.value.trim().length > 0)}
            onChange={(e) => setName(e.target.value)}
            readOnly={readOnly}
          />
          {showEditIcon && !readOnly && (
            <EditIcon
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
              }}
              height="16"
              color={theme.palette.text.secondary}
            />
          )}
        </Stack>
      </Fade>
      <Fade in={showPrompt} mountOnEnter unmountOnExit>
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
