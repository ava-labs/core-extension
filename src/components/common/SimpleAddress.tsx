import {
  SimpleAddress as Original,
  SimpleAddressProps,
} from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

export function SimpleAddress(props: SimpleAddressProps) {
  const { t } = useTranslation();

  return <Original copyCompleteText={t('Copied!')} {...props} />;
}
