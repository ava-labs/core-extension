import {
  Button,
  Collapse,
  Fade,
  Grow,
  IconButton,
  Stack,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

import { CrossFadeIcon } from '../CrossFadeIcon';
import { InvisibleAddressInput } from '../InvisibleInput';

type AddressFieldProps = {
  value: string;
  label: string;
  placeholder: string;
  prompt: string;
  error?: string;
  onChange: (value: string) => void;
  allowCopy?: boolean;
};

export const AddressField = ({
  value,
  label,
  placeholder,
  prompt,
  error,
  onChange,
  allowCopy = false,
}: AddressFieldProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const iconSlots = useMemo(
    () => ({
      add: (
        <IconButton
          onClick={() => setIsEditing(true)}
          size="small"
          sx={{ p: 0 }}
        >
          <MdAddCircle size={20} fill={theme.palette.success.main} />
        </IconButton>
      ),
      remove: (
        <IconButton onClick={() => onChange('')} size="small" sx={{ p: 0 }}>
          <MdRemoveCircle size={20} fill={theme.palette.error.main} />
        </IconButton>
      ),
    }),
    [onChange, theme.palette.error.main, theme.palette.success.main],
  );

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);

  const showCopyButton =
    allowCopy && !error && !!value && !isEditing && isHovered;

  return (
    <AddressFieldContainer
      paddingBlock={theme.spacing(!isEditing && value ? 0.25 : 1)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CrossFadeIcon
        size={20}
        slots={iconSlots}
        active={isEditing || value ? 'remove' : 'add'}
      />

      <AddressInputContainer>
        <Fade in={isEditing || !!value} mountOnEnter unmountOnExit>
          <Stack
            position="absolute"
            width="100%"
            component="label"
            onClick={() => setIsEditing(true)}
          >
            <InvisibleAddressInput
              ref={ref}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
            />
            <Collapse in={!isEditing} orientation="vertical">
              <Typography
                variant="caption"
                color={error ? 'error.light' : 'text.secondary'}
              >
                {error || label}
              </Typography>
            </Collapse>
          </Stack>
        </Fade>
        <Fade in={!isEditing && !value} mountOnEnter unmountOnExit>
          <AddAddressPrompt onClick={() => setIsEditing(true)}>
            {prompt}
          </AddAddressPrompt>
        </Fade>
      </AddressInputContainer>
      <Grow in={showCopyButton} mountOnEnter unmountOnExit>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          {t('Copy')}
        </Button>
      </Grow>
    </AddressFieldContainer>
  );
};

const AddressFieldContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: theme.transitions.create('padding-block'),
  height: 36,
}));

const AddressInputContainer = styled(Stack)({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
});

const AddAddressPrompt = styled((props: TypographyProps) => (
  <Typography {...props} variant="subtitle1" role="button" />
))(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { color: theme.palette.text.secondary },
}));
