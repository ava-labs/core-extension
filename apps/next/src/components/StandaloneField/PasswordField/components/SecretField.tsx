import { Stack, TextField, Typography } from '@avalabs/k2-alpine';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShowPasswordAdornment } from './ShowPasswordAdornment';
import { StandaloneFieldProps } from '../../StandaloneField';
import { AlertCircleIcon } from '@avalabs/core-k2-components';

type SecretFieldProps = StandaloneFieldProps & {
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  value: string;
  placeholder?: string;
  errorText?: string;
};

export const SecretField = ({
  onChange,
  value,
  placeholder,
  errorText,
}: SecretFieldProps) => {
  const { t } = useTranslation();
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Stack>
      <TextField
        variant="filled"
        label={t('Enter Private Key')}
        slotProps={{
          inputLabel: {
            sx: { transform: 'none', fontSize: 'body2.fontSize' },
          },
          input: {
            disableUnderline: true,
            sx: {
              borderRadius: 2,
            },
            endAdornment: (
              <ShowPasswordAdornment
                visible={showPassword}
                onHide={() => setShowPassword(false)}
                onShow={() => setShowPassword(true)}
              />
            ),
          },
        }}
        onChange={(e) => {
          onChange(e);
          if (!isFormDirty) setIsFormDirty(true);
        }}
        value={value}
        placeholder={placeholder ?? t('Enter your password')}
        type={showPassword ? 'text' : 'password'}
      />

      {errorText && (
        <Stack
          direction="row"
          sx={{
            mt: '10px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            columnGap: 1,
          }}
        >
          <AlertCircleIcon size={24} sx={{ color: 'error.main' }} />
          <Typography color="error">{errorText}</Typography>
        </Stack>
      )}
    </Stack>
  );
};
