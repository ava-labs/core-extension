import {
  HorizontalFlex,
  PrimaryButton,
  Typography,
  VerticalFlex,
} from '@avalabs/react-components';
import { t } from 'i18next';

export function TxComplete({ hash }: { hash?: string }) {
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
