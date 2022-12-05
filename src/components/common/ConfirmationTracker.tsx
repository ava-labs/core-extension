import {
  ConfirmationTracker as Original,
  ConfirmationTrackerProps,
} from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

export function ConfirmationTracker(props: ConfirmationTrackerProps) {
  const { t } = useTranslation();

  return <Original startText={t('Start')} finalText={t('Final')} {...props} />;
}
