import { Input, InputProps } from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

export function PasswordInput(props: InputProps) {
  const { t } = useTranslation();

  return (
    <Input
      passwordShowText={t('Show')}
      passwordHideText={t('Hide')}
      type="password"
      {...props}
    />
  );
}
