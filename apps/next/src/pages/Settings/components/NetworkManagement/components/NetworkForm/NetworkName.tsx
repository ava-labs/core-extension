import {
  InvisibleNameInput,
  NAME_INPUT_HEIGHT,
  StyledNameButton,
} from '@/components/Forms/InvisibleInput';
import { Stack, Fade } from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';

type NetworkNameProps = {
  name?: string;
  setName: (name: string) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  autoFocus: boolean;
};

export const NetworkName = ({
  name,
  setName,
  editing,
  setEditing,
  autoFocus,
}: NetworkNameProps) => {
  const { t } = useTranslation();
  return (
    <Stack
      width="100%"
      position="relative"
      overflow="hidden"
      height={NAME_INPUT_HEIGHT}
    >
      <Fade in={editing} mountOnEnter unmountOnExit>
        <InvisibleNameInput
          sx={{
            position: 'absolute',
            paddingInline: 0,
            width: '100%',
          }}
          value={name}
          autoFocus={autoFocus}
          onBlur={(e) => setEditing(e.target.value.trim().length > 0)}
          onChange={(e) => setName(e.target.value)}
        />
      </Fade>
      <Fade in={!editing} mountOnEnter unmountOnExit>
        <StyledNameButton
          variant="contained"
          color="secondary"
          size="extension"
          onClick={() => setEditing(true)}
        >
          {t('Name this network')}
        </StyledNameButton>
      </Fade>
    </Stack>
  );
};
