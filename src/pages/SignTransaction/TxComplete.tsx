import {
  HorizontalFlex,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { useTranslation } from 'react-i18next';

export function TxComplete({ hash }: { hash?: string }) {
  const { t } = useTranslation();
  return (
    <VerticalFlex>
      <Typography>{t('Tx Finished')}</Typography>
      <Typography>{hash}</Typography>
      <HorizontalFlex>
        <PrimaryButton onClick={() => window.close()}>
          {t('Close')}
        </PrimaryButton>
      </HorizontalFlex>
    </VerticalFlex>
  );
}
