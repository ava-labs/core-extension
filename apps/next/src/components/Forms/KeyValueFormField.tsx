import {
  Button,
  Collapse,
  Divider,
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
import { InvisibleFieldInput } from './InvisibleInput';

type KeyValue = {
  key: string;
  value: string;
};

type FormFieldProps = {
  value: KeyValue;
  label: string;
  placeholder: string;
  prompt: string;
  error?: string;
  onChange: (value: KeyValue) => void;
  allowCopy?: boolean;
};

export const KeyValueFormField = ({
  value: values,
  label,
  placeholder,
  prompt,
  error,
  onChange,
  allowCopy = false,
}: FormFieldProps) => {
  const { key, value } = values;
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
      onChange({ key: '', value: '' });
    } else {
      setIsEditing(true);
    }
  }, [showRemoveIcon, onChange]);

  return (
    <FieldContainer
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

      <InputContainer>
        <Fade in={isEditing || !!value} mountOnEnter unmountOnExit>
          <Stack
            position="absolute"
            width="100%"
            component="label"
            onClick={() => setIsEditing(true)}
          >
            <InvisibleFieldInput
              ref={ref}
              value={key}
              placeholder={placeholder}
              onChange={(e) => onChange({ ...values, key: e.target.value })}
              onBlur={() => delay(() => setIsEditing(false), 100)}
            />
            <Divider />
            <InvisibleFieldInput
              ref={ref}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange({ ...values, value: e.target.value })}
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
          <AddPrompt onClick={() => setIsEditing(true)}>{prompt}</AddPrompt>
        </Fade>
      </InputContainer>
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
    </FieldContainer>
  );
};

const FieldContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: theme.transitions.create(['padding-block', 'height']),
  height: 36,
}));

const InputContainer = styled(Stack)({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
});

const AddPrompt = styled((props: TypographyProps) => (
  <Typography {...props} variant="subtitle3" role="button" />
))(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { color: theme.palette.text.secondary },
}));
