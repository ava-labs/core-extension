import { useTranslation } from 'react-i18next';
import { Button, Fade, Stack, styled } from '@avalabs/k2-alpine';

import { InvisibleNameInput, NAME_INPUT_HEIGHT } from './InvisibleInput';

type ContactNameFieldProps = {
  name: string;
  setName: (name: string) => void;
  isNaming: boolean;
  setIsNaming: (isNaming: boolean) => void;
  autoFocus: boolean;
};

export const ContactNameField = ({
  name,
  setName,
  isNaming,
  setIsNaming,
  autoFocus,
}: ContactNameFieldProps) => {
  const { t } = useTranslation();

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
          {t('Name this contact')}
        </StyledNameButton>
      </Fade>
    </Stack>
  );
};

const StyledNameButton = styled(Button)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
});
