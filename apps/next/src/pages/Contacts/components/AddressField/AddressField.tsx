import {
  Button,
  Collapse,
  Fade,
  Grow,
  Stack,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from '@avalabs/k2-alpine';
import { delay } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';

import { MultiIconButton } from '@/components/MultiIconButton';
import { InvisibleFieldInput } from '@/components/Forms/InvisibleInput';

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

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);

  const showCopyButton =
    allowCopy && !error && !!value && !isEditing && isHovered;

  const showRemoveIcon = Boolean(value || isEditing);

  const onActionClick = useCallback(() => {
    if (showRemoveIcon) {
      setIsEditing(false);
      onChange('');
    } else {
      setIsEditing(true);
    }
  }, [showRemoveIcon, onChange]);

  return (
    <AddressFieldContainer
      paddingBlock={theme.spacing(isEditing || value ? 0.25 : 1)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ height: isEditing || value ? 48 : 36 }}
    >
      <MultiIconButton
        icon={<MdAddCircle size={20} fill={theme.palette.success.main} />}
        hoverIcon={<MdRemoveCircle size={20} fill={theme.palette.error.main} />}
        onClick={onActionClick}
        toggleClassName="has-value"
        className={showRemoveIcon ? 'has-value' : ''}
      />

      <AddressInputContainer>
        <Fade in={isEditing || !!value} mountOnEnter unmountOnExit>
          <Stack
            position="absolute"
            width="100%"
            component="label"
            onClick={() => setIsEditing(true)}
          >
            <InvisibleFieldInput
              ref={ref}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => delay(() => setIsEditing(false), 100)}
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
  transition: theme.transitions.create(['padding-block', 'height']),
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
  <Typography {...props} variant="subtitle3" role="button" />
))(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { color: theme.palette.text.secondary },
}));
