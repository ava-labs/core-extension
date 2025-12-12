import {
  Button,
  Collapse,
  Fade,
  Grow,
  Stack,
  styled,
  toast,
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

type FormFieldProps = {
  type?: 'text' | 'number';
  pattern?: string;
  value: string;
  label: string;
  placeholder: string;
  prompt: string;
  error?: string;
  onChange: (value: string) => void;
  allowCopy?: boolean;
  required?: boolean;
  endAdornment?: React.ReactNode;
  readOnly?: boolean;
  'data-testid'?: string;
};

export const FormField = ({
  type = 'text',
  pattern,
  value,
  label,
  placeholder,
  prompt,
  error,
  onChange,
  allowCopy = false,
  required = false,
  endAdornment,
  readOnly = false,
  'data-testid': dataTestId,
}: FormFieldProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [wasTouched, setWasTouched] = useState(false);

  const showPrompt = Boolean(value || isEditing || (wasTouched && required));
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setWasTouched(true);
      onChange(e.target.value);
    },
    [onChange],
  );

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);

  const showCopyButton =
    allowCopy && !error && !!value && !isEditing && isHovered;

  const onActionClick = useCallback(() => {
    if (showPrompt) {
      setIsEditing(false);
      onChange('');
    } else {
      setIsEditing(true);
    }
  }, [showPrompt, onChange]);

  return (
    <FieldContainer
      data-testid={dataTestId}
      paddingBlock={theme.spacing(isEditing || value ? 0.25 : 1)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ height: isEditing || value ? 48 : 36 }}
    >
      {!readOnly && (
        <MultiIconButton
          icon={<MdAddCircle size={20} fill={theme.palette.success.main} />}
          hoverIcon={
            <MdRemoveCircle size={20} fill={theme.palette.error.main} />
          }
          onClick={onActionClick}
          toggleClassName="has-value"
          className={showPrompt ? 'has-value' : ''}
        />
      )}

      <InputContainer>
        <Fade in={showPrompt} mountOnEnter unmountOnExit>
          <Stack
            direction="row"
            alignItems="center"
            width="100%"
            justifyContent="space-between"
          >
            <Stack component="label" onClick={() => setIsEditing(true)}>
              <InvisibleFieldInput
                type={type}
                ref={ref}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={() => delay(() => setIsEditing(false), 100)}
                readOnly={readOnly}
                pattern={pattern}
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
            {!!endAdornment && endAdornment}
          </Stack>
        </Fade>
        <Fade in={!showPrompt} mountOnEnter unmountOnExit>
          <AddPrompt onClick={() => setIsEditing(true)}>{prompt}</AddPrompt>
        </Fade>
      </InputContainer>
      <Grow in={showCopyButton} mountOnEnter unmountOnExit>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => {
            toast.success(t('Copied!'));
            navigator.clipboard.writeText(value);
          }}
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
