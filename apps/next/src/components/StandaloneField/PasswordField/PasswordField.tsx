import animations from '@/lib/animations';
import { styled } from '@avalabs/k2-alpine';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StandaloneField, StandaloneFieldProps } from '../StandaloneField';
import { ShowPasswordAdornment } from './components/ShowPasswordAdornment';

const ShakyStandaloneField = styled(StandaloneField)`
  ${({ error }) => (error ? animations.shake : '')};
`;

export const PasswordField: FC<StandaloneFieldProps> = (props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <ShakyStandaloneField
      {...props}
      type={showPassword ? 'text' : 'password'}
      placeholder={props.placeholder ?? t('Enter your password')}
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
