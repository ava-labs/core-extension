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

export type KeyValue = {
  key: string;
  value: string;
};

type FormFieldProps = {
  values: KeyValue;
  labels: KeyValue;
  placeholders: KeyValue;
  prompt: string;
  error?: string;
  onChange: (value: KeyValue) => void;
  allowCopy?: boolean;
  readonly?: boolean;
};

export const KeyValueFormField = ({
  values,
  labels,
  placeholders,
  prompt,
  error,
  onChange,
  allowCopy = false,
  readonly = false,
}: FormFieldProps) => {
  const { key, value } = values;
  const theme = useTheme();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const refKey = useRef<HTMLInputElement>(null);
  const refValue = useRef<HTMLInputElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isEditing && refKey.current) {
      refKey.current.focus();
    }
  }, [isEditing]);

  const showCopyButton =
    allowCopy && !error && !!value && !isEditing && isHovered;

  const showRemoveIcon = Boolean(key || value || isEditing);

  const showPrompt = !isEditing && !key && !value;

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
      sx={{ height: isEditing || value ? 80 : 48 }}
    >
      <MultiIconButton
        icon={<MdAddCircle size={20} fill={theme.palette.success.main} />}
        hoverIcon={<MdRemoveCircle size={20} fill={theme.palette.error.main} />}
        onClick={onActionClick}
        toggleClassName="has-value"
        className={showRemoveIcon ? 'has-value' : ''}
      />

      <InputContainer>
        <Fade in={!showPrompt} mountOnEnter unmountOnExit>
          <Stack
            position="absolute"
            width="100%"
            component="label"
            onClick={() => setIsEditing(true)}
            onBlur={(e) => {
              // Only exit editing mode if focus is moving outside this form field
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                delay(() => setIsEditing(false), 100);
              }
            }}
            rowGap={1}
          >
            {/* Key */}
            <Stack>
              <InvisibleFieldInput
                ref={refKey}
                value={key}
                placeholder={placeholders.key}
                onChange={(e) => onChange({ ...values, key: e.target.value })}
                readOnly={readonly}
              />
              <Collapse in={!isEditing} orientation="vertical">
                <Typography
                  variant="caption"
                  color={error ? 'error.light' : 'text.secondary'}
                >
                  {error || labels.key}
                </Typography>
              </Collapse>
            </Stack>

            <Divider />

            {/* Value */}
            <Stack>
              <InvisibleFieldInput
                ref={refValue}
                value={value}
                placeholder={placeholders.value}
                onChange={(e) => onChange({ ...values, value: e.target.value })}
                readOnly={readonly}
              />
              <Collapse in={!isEditing} orientation="vertical">
                <Typography
                  variant="caption"
                  color={error ? 'error.light' : 'text.secondary'}
                >
                  {error || labels.value}
                </Typography>
              </Collapse>
            </Stack>
          </Stack>
        </Fade>
        <Fade in={showPrompt} mountOnEnter unmountOnExit>
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
