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
  const showIcon = showEditIcon && !readOnly && !isNaming;

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
          position="absolute"
          paddingInline={0}
          width="100%"
          columnGap={0.75}
        >
          <InvisibleNameInput
            value={name}
            autoFocus={autoFocus}
            onClick={() => setIsNaming(true)}
            onBlur={() => setIsNaming(false)}
            onChange={(e) => setName(e.target.value)}
            readOnly={readOnly}
            style={{
              width: showIcon ? 'calc(100% - 8px)' : '100%',
            }}
          />
          {showIcon && (
            <EditIcon height="21px" color={theme.palette.text.secondary} />
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
