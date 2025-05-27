import { FC, useState } from 'react';
import { ShowPasswordAdornment } from './components/ShowPasswordAdornment';
import { StandaloneField, StandaloneFieldProps } from '../StandaloneField';
import { useTranslation } from 'react-i18next';

export const PasswordField: FC<StandaloneFieldProps> = (props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <StandaloneField
      {...props}
      type={showPassword ? 'text' : 'password'}
      placeholder={t('Enter your password')}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          endAdornment: (
            <ShowPasswordAdornment
              visible={showPassword}
              onHide={() => setShowPassword(false)}
              onShow={() => setShowPassword(true)}
            />
          ),
        },
      }}
    />
  );
};
