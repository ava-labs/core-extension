import { BNInput as Original, BNInputProps } from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

export function BNInput(props: BNInputProps) {
  const { t } = useTranslation();

  return (
    <Original
      insufficientBalanceErrorText={t('Insufficient balance')}
      {...props}
    />
  );
}
